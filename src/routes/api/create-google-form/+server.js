import { json } from '@sveltejs/kit';

export const POST = async ({ request, cookies }) => {
    const formData = await request.json();
    const accessToken = cookies.get('userToken');

    if (!accessToken) {
        return json({ error: 'Access token is missing' }, { status: 401 });
    }

    try {
        // Step 1: Create the form with a title
        const createFormResponse = await fetch('https://forms.googleapis.com/v1/forms', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ info: { title: formData.info.title } })
        });

        if (!createFormResponse.ok) {
            const errorText = await createFormResponse.text();
            console.error('Create form response:', errorText);
            throw new Error(`Failed to create form: ${createFormResponse.statusText}`);
        }

        const createdForm = await createFormResponse.json();
        const formId = createdForm.formId;

        // Step 2: Add description and questions using batchUpdate
        const batchUpdateUrl = `https://forms.googleapis.com/v1/forms/${formId}:batchUpdate`;

        const updatePayload = {
            requests: [
                {
                    updateFormInfo: {
                        info: {
                            description: formData.info.description
                        },
                        updateMask: "description"
                    }
                },
                ...formData.items.map((question, index) => ({
                    createItem: {
                        item: {
                            title: question.title,
                            questionItem: {
                                question: {
                                    required: question.required || false,
                                    ...(question.questionItem.question.choiceQuestion
                                        ? { choiceQuestion: question.questionItem.question.choiceQuestion }
                                        : { textQuestion: {} })
                                }
                            }
                        },
                        location: {
                            index
                        }
                    }
                }))
            ]
        };

        const updateResponse = await fetch(batchUpdateUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatePayload)
        });

        if (!updateResponse.ok) {
            const errorText = await updateResponse.text();
            console.error('Update form response:', errorText);
            throw new Error(`Failed to update form: ${updateResponse.statusText}`);
        }

        const updateData = await updateResponse.json();

        // Return form creation details
        return json({
            formId,
            formUrl: createdForm.responderUri,
            message: "Form created and updated successfully."
        });
    } catch (error) {
        console.error('Error creating Google Form:', error);
        return json({ error: `Failed to create Google Form: ${error.message}` }, { status: 500 });
    }
};
