import { json } from '@sveltejs/kit';

export const POST = async ({ request, cookies }) => {
    const formData = await request.json();
    const accessToken = cookies.get('userToken');

    if (!accessToken) {
        return json({ error: 'Access token is missing' }, { status: 401 });
    }

    try {
        const formId = formData.formId;
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
                            image: question.image ? { sourceUri: question.image } : null, // Attach image to the question
                            questionItem: {
                                question: {
                                    required: question.required || false,
                                    ...(question.questionItem.question.choiceQuestion
                                        ? { choiceQuestion: question.questionItem.question.choiceQuestion }
                                        : { textQuestion: {} }),
                                    ...(question.questionItem.question.grading && {
                                        grading: {
                                            pointValue: question.questionItem.question.grading.pointValue,
                                            correctAnswers: question.questionItem.question.grading.correctAnswers
                                        }
                                    })
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

        // Return form update details
        return json({
            formId,
            message: "Form updated successfully with images embedded in questions."
        });
    } catch (error) {
        console.error('Error updating Google Form:', error);
        return json({ error: `Failed to update Google Form: ${error.message}` }, { status: 500 });
    }
};
