import { redirect } from '@sveltejs/kit';
import { OAuth2Client } from 'google-auth-library';
import { SECRET_CLIENT_ID, SECRET_CLIENT_SECRET } from '$env/static/private';

const oAuth2Client = new OAuth2Client(
    SECRET_CLIENT_ID,
    SECRET_CLIENT_SECRET,
    'http://localhost:5173/oauth' // Update with your redirect URL
);

export const actions = {
    OAuth2: async ({ cookies }) => {
        const authorizeUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: [
                'https://www.googleapis.com/auth/forms.body',
                'https://www.googleapis.com/auth/drive.file',
                'https://www.googleapis.com/auth/userinfo.profile',
                'https://www.googleapis.com/auth/userinfo.email'
            ],
            prompt: 'consent'
        });

        throw redirect(302, authorizeUrl);
    }
};

export const load = async ({ cookies }) => {
    const token = cookies.get('auth_token');
    if (!token) return { isSignedIn: false };

    oAuth2Client.setCredentials({ access_token: token });

    try {
        const userInfo = await oAuth2Client.request({
            url: 'https://www.googleapis.com/oauth2/v2/userinfo'
        });

        return {
            isSignedIn: true,
            userEmail: userInfo.data.email
        };
    } catch (error) {
        console.error('Error fetching user info:', error);
        return { isSignedIn: false };
    }
};
