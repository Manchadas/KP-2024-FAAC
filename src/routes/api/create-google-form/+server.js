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

        // Step 2: Enable quiz mode if there are graded questions
        const hasGradedQuestions = formData.items.some(
            (item) =>
                item.questionItem?.question?.grading &&
                item.questionItem.question.grading.pointValue > 0 &&
                item.questionItem.question.grading.correctAnswers?.answers?.length > 0
        );

        if (hasGradedQuestions) {
            const quizSettingsPayload = {
                requests: [
                    {
                        updateSettings: {
                            settings: {
                                quizSettings: { isQuiz: true }
                            },
                            updateMask: "quizSettings.isQuiz"
                        }
                    }
                ]
            };

            const quizResponse = await fetch(
                `https://forms.googleapis.com/v1/forms/${formId}:batchUpdate`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(quizSettingsPayload)
                }
            );

            if (!quizResponse.ok) {
                const quizError = await quizResponse.text();
                console.error('Quiz settings response:', quizError);
                throw new Error('Failed to enable quiz mode');
            }
        }

        // Step 3: Add description and questions using batchUpdate
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
                                        : { textQuestion: {} }),
                                    ...(question.questionItem.question.grading && {
                                        grading: {
                                            pointValue: 1, // Default point value
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

        // Return form creation details
        return json({
            formId,
            formUrl: createdForm.responderUri,
            message: "Form created successfully." + (hasGradedQuestions ? " Quiz mode enabled." : "")
        });
    } catch (error) {
        console.error('Error creating Google Form:', error);
        return json({ error: `Failed to create Google Form: ${error.message}` }, { status: 500 });
    }
};
