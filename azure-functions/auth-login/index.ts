import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

// Database connection
const pool = new Pool({
  host: process.env.AZURE_POSTGRESQL_HOST,
  database: process.env.AZURE_POSTGRESQL_DATABASE,
  user: process.env.AZURE_POSTGRESQL_USERNAME,
  password: process.env.AZURE_POSTGRESQL_PASSWORD,
  port: 5432,
  ssl: { rejectUnauthorized: false }
});

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  context.log('Azure AD B2C user authentication');

  if (req.method !== 'POST') {
    context.res = {
      status: 405,
      body: { message: 'Method not allowed' }
    };
    return;
  }

  try {
    // In Azure AD B2C flow, this endpoint would validate the token
    // and sync user data with your database
    const { accessToken, userInfo } = req.body;

    if (!accessToken || !userInfo) {
      context.res = {
        status: 400,
        body: { message: 'Access token and user info required' }
      };
      return;
    }

    // Validate Azure AD B2C token (implement token validation logic)
    // For now, we'll assume the token is valid and extract user info

    const { email, given_name, family_name, oid } = userInfo;

    // Check if user exists in database
    const client = await pool.connect();
    
    try {
      let user;
      const existingUser = await client.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );

      if (existingUser.rows.length === 0) {
        // Create new user
        const newUser = await client.query(
          'INSERT INTO users (id, email, first_name, last_name, points) VALUES ($1, $2, $3, $4, 0) RETURNING *',
          [oid, email, given_name, family_name]
        );
        user = newUser.rows[0];
      } else {
        // Update existing user
        const updatedUser = await client.query(
          'UPDATE users SET first_name = $1, last_name = $2 WHERE email = $3 RETURNING *',
          [given_name, family_name, email]
        );
        user = updatedUser.rows[0];
      }

      context.res = {
        status: 200,
        body: {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            createdAt: user.created_at,
            points: user.points
          },
          message: 'Authentication successful'
        }
      };

    } finally {
      client.release();
    }

  } catch (error) {
    context.log.error('Login error:', error);
    context.res = {
      status: 500,
      body: { message: 'Internal server error' }
    };
  }
};

export default httpTrigger;