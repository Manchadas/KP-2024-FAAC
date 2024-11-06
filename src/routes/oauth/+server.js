import { json } from '@sveltejs/kit';
import { OAuth2Client } from 'google-auth-library';
import { SECRET_CLIENT_ID, SECRET_CLIENT_SECRET } from '$env/static/private';

const scopes = [
    'https://www.googleapis.com/auth/forms.body',
    'https://www.googleapis.com/auth/drive.file' 
];

const oAuth2Client = new OAuth2Client(
    SECRET_CLIENT_ID,
    SECRET_CLIENT_SECRET,
    'http://localhost:5173/oauth' 
);

export const GET = async ({ url, cookies }) => {
    const code = url.searchParams.get('code');

    if (!code) {
        // If there is no code, redirect the user to the authorization URL
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES,
            prompt: 'consent'
        });
        return new Response(null, {
            status: 303,
            headers: {
                Location: authUrl
            }
        });
    }

    try {
        const tokenResponse = await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(tokenResponse.tokens);

        console.info('Tokens acquired and set');
        const accessToken = tokenResponse.tokens.access_token;

        if (accessToken) {
            cookies.set('userToken', accessToken, {
                path: '/',
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 3600 // 1 hour
            });

            console.log('Access token set in cookies.');

            
            return new Response(null, {
                status: 303,
                headers: {
                    Location: '/form-builder' 
                }
            });
        } else {
            return new Response('Authentication failed', { status: 401 });
        }
    } catch (error) {
        console.error('Error during OAuth2 callback:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
};

export const POST = async ({ request, cookies }) => {
    const formData = await request.json();
    const accessToken = cookies.get('userToken');

    if (!accessToken) {
        return json({ error: 'Access token is missing' }, { status: 401 });
    }

    try {
        const createdForm = await createGoogleForm(accessToken, formData);
        return json(createdForm, { status: 200 });
    } catch (error) {
        console.error('Failed to create form:', error);
        return json({ error: 'Failed to create form' }, { status: 500 });
    }
};

// Function to create a Google Form
async function createGoogleForm(accessToken, formData) {
    try {
        console.log('Starting to create Google Form');

        const createResponse = await fetch('https://forms.googleapis.com/v1/forms', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                info: {
                    title: formData.title,
                    documentTitle: formData.title
                }
            })
        });

        if (!createResponse.ok) {
            const errorText = await createResponse.text();
            console.error('Create form response:', errorText);
            throw new Error(`Failed to create form: ${createResponse.statusText}`);
        }

        const createdForm = await createResponse.json();
        const formId = createdForm.formId;
        console.log('Form created:', formId);

        const updateResponse = await fetch(`https://forms.googleapis.com/v1/forms/${formId}:batchUpdate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                requests: formData.questions.map(question => {
                    return {
                        createItem: {
                            item: {
                                title: question.text,
                                questionItem: {
                                    question: {
                                        required: question.required,
                                        choiceQuestion: question.options.length > 0 ? {
                                            type: question.type === 'checkbox' ? 'CHECKBOX' : 'RADIO',
                                            options: question.options.map(option => ({ value: option.text }))
                                        } : undefined
                                    }
                                }
                            },
                            location: {
                                index: 'LAST'
                            }
                        }
                    };
                })
            })
        });

        if (!updateResponse.ok) {
            const errorText = await updateResponse.text();
            console.error('Update form response:', errorText);
            throw new Error(`Failed to add items: ${updateResponse.statusText}`);
        }

        const updateData = await updateResponse.json();
        console.log('Form updated with items:', updateData);

        return { formId, formUrl: createdForm.responderUri };

    } catch (error) {
        console.error('Error creating Google Form:', error);
        throw error;
    }
}
