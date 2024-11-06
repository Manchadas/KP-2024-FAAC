import { json } from '@sveltejs/kit';
import { GOOGLE_ACCESS_TOKEN } from '$env/static/private';

export async function POST({ request }) {
    const { formId, description, questions } = await request.json();

    try {
        const batchUpdateUrl = `https://forms.googleapis.com/v1/forms/${formId}:batchUpdate`;

        const updatePayload = {
            requests: [
                {
                    updateFormInfo: {
                        info: { description },
                        updateMask: 'description'
                    }
                },
                ...questions.map((question, index) => ({
                    createItem: {
                        item: {
                            title: question.title,
                            questionItem: {
                                question: question.questionItem.question
                            }
                        },
                        location: { index }
                    }
                }))
            ]
        };

        const updateResponse = await fetch(batchUpdateUrl, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${GOOGLE_ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatePayload)
        });

        if (!updateResponse.ok) {
            const error = await updateResponse.json();
            throw new Error(error.error.message);
        }

        return json({ success: true });
    } catch (error) {
        console.error('Failed to update Google Form:', error);
        return json({ error: 'Failed to update Google Form' }, { status: 500 });
    }
}
