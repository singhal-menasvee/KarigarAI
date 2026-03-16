import { createRemoteJWKSet, jwtVerify } from 'jose';

function getBearerToken(req) {
  const header = req.headers.authorization || '';
  const [type, token] = header.split(' ');
  if (type !== 'Bearer' || !token) return null;
  return token;
}

let jwks = null;
function getJwks() {
  const issuer = process.env.CLERK_ISSUER;
  if (!issuer) return null;
  if (!jwks) {
    jwks = createRemoteJWKSet(new URL(`${issuer}/.well-known/jwks.json`));
  }
  return jwks;
}

export async function requireClerkAuth(req, res, next) {
  try {
    const token = getBearerToken(req);
    if (!token) {
      return res.status(401).json({ error: { message: 'Missing Bearer token' } });
    }

    const issuer = process.env.CLERK_ISSUER;
    const jwksSet = getJwks();
    if (!issuer || !jwksSet) {
      return res.status(500).json({
        error: { message: 'Server auth not configured (missing CLERK_ISSUER)' },
      });
    }

    const { payload } = await jwtVerify(token, jwksSet, { issuer });

    // Clerk session JWT typically includes a `sub` (userId) and `sid` (sessionId)
    req.auth = {
      userId: payload.sub,
      sessionId: payload.sid,
      orgId: payload.org_id,
      claims: payload,
    };

    if (!req.auth.userId) {
      return res.status(401).json({ error: { message: 'Invalid token' } });
    }

    return next();
  } catch (err) {
    err.statusCode = 401;
    return next(err);
  }
}

