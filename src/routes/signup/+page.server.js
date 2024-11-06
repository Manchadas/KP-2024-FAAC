import { redirect } from '@sveltejs/kit';
import { OAuth2Client } from 'google-auth-library';
import { SECRET_CLIENT_ID, SECRET_CLIENT_SECRET } from '$env/static/private';

export const actions = {
    OAuth2: async () => {
        const redirectURL = 'http://localhost:5173/oauth';

        const oAuth2Client = new OAuth2Client(
            SECRET_CLIENT_ID,
            SECRET_CLIENT_SECRET,
            redirectURL
        );

        // Include the necessary scopes for Google Forms and Drive
        const authorizeUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: [
                'https://www.googleapis.com/auth/forms.body',
                'https://www.googleapis.com/auth/drive.file',
                'openid',
                'https://www.googleapis.com/auth/userinfo.profile',
                'https://www.googleapis.com/auth/userinfo.email' // optional, if you need the email
            ],
            prompt: 'consent'
        });

        throw redirect(302, authorizeUrl);
    }
};
