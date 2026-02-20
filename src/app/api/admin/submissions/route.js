import Notification from '@/models/Notification';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Submission from '@/models/Submission';
import Project from '@/models/Project';
import User from '@/models/User';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req) {
    try {
        await connectDB();
        const user = await getUserFromRequest(req);
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const submissions = await Submission.find({})
            .populate('student', 'name email avatar role')
            .populate('project', 'title domain difficulty points duration technologies skills description requirements resources image steps')
            .sort({ createdAt: -1 });

        return NextResponse.json({ submissions });
    } catch (error) {
        console.error('Fetch submissions error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        await connectDB();
        const user = await getUserFromRequest(req);
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const body = await req.json();
        const { id, status, grade, feedback, stepIndex, stepStatus, stepFeedback, totalScore } = body;

        if (!id) {
            return NextResponse.json({ error: 'Missing submission ID' }, { status: 400 });
        }

        const submission = await Submission.findById(id)
            .populate('student', 'name email avatar role')
            .populate('project');

        if (!submission) {
            return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
        }

        if (stepIndex !== undefined) {
            const stepSub = submission.stepSubmissions.find(s => s.stepIndex === stepIndex);

            if (!stepSub) {
                return NextResponse.json({ error: 'Cannot review a step that has not been submitted' }, { status: 400 });
            }

            if (stepStatus) stepSub.status = stepStatus;

            // Handle feedback from either step-specific feedback or finalFeedback (for last step)
            if (body.finalFeedback) stepSub.feedback = body.finalFeedback;
            else if (stepFeedback !== undefined) stepSub.feedback = stepFeedback;

            // Update completedSteps/Submission Status
            if (stepStatus === 'approved') {
                if (!submission.completedSteps.includes(stepIndex)) {
                    submission.completedSteps.push(stepIndex);
                }

                // Check if this is the final step
                if (submission.project && submission.project.steps && stepIndex === submission.project.steps.length - 1) {

                    // Validate mandatory grading fields for final step
                    if (!grade) {
                        return NextResponse.json({ error: 'Grade is mandatory for final step approval' }, { status: 400 });
                    }
                    if (totalScore === undefined || totalScore === null) {
                        return NextResponse.json({ error: 'Total Score is mandatory for final step approval' }, { status: 400 });
                    }

                    // Finalize submission
                    submission.status = 'completed'; // Set to completed as per new workflow
                    submission.grade = grade;
                    submission.totalScore = totalScore;
                    if (body.finalFeedback) submission.feedback = body.finalFeedback;

                    // sync git link from final step content
                    try {
                        const content = JSON.parse(stepSub.content);
                        if (content && content.link) {
                            submission.githubUrl = content.link;
                        }
                    } catch (e) {
                        // If content is not JSON or doesn't have link, ignore
                        console.log("Could not parse final step content for git link", e);
                    }
                }

            } else if (stepStatus === 'rejected') {
                if (!stepFeedback || stepFeedback.trim().length < 5) {
                    return NextResponse.json({ error: 'Feedback is mandatory when rejecting a step' }, { status: 400 });
                }
                submission.completedSteps = submission.completedSteps.filter(i => i !== stepIndex);
                submission.status = 'rejected';

                await Notification.create({
                    type: 'project_rejected',
                    message: `Step ${stepIndex + 1} of project "${submission.project?.title}" was rejected. Please check feedback.`,
                    forRole: 'student',
                    forUserId: submission.student,
                });
            }

            const maxCompleted = submission.completedSteps.length > 0 ? Math.max(...submission.completedSteps) : -1;
            submission.currentStep = maxCompleted + 1;

        } else {
            // Handle Global update (Legacy/Fallback)
            if (status === 'accepted') {
                if (!grade) {
                    return NextResponse.json({ error: 'Grade is mandatory to accept and complete project' }, { status: 400 });
                }
                if (totalScore === undefined || totalScore === null) {
                    return NextResponse.json({ error: 'Total Score is mandatory to accept and complete project' }, { status: 400 });
                }
                if (!feedback || feedback.trim().length < 10) {
                    return NextResponse.json({ error: 'Detailed feedback (min 10 chars) is mandatory for final project review' }, { status: 400 });
                }
            }

            if (status) submission.status = status;
            if (grade !== undefined) submission.grade = grade;
            if (feedback !== undefined) submission.feedback = feedback;
            if (totalScore !== undefined) submission.totalScore = totalScore;

            // If completing, ensure grade/score are present
            if (status === 'completed') {
                if (!submission.grade) {
                    return NextResponse.json({ error: 'Grade is mandatory to complete project' }, { status: 400 });
                }
                if (submission.totalScore === undefined || submission.totalScore === null) {
                    return NextResponse.json({ error: 'Total Score is mandatory to complete project' }, { status: 400 });
                }
            }

            // Sync completedSteps if project is fully accepted/completed
            if ((status === 'accepted' || status === 'completed') && submission.project && submission.project.steps) {
                // Ensure all steps are marked as completed
                const totalSteps = submission.project.steps.length;
                submission.completedSteps = Array.from({ length: totalSteps }, (_, i) => i);

                // Also ensure the status is standardized to 'completed' for the final state
                if (status === 'accepted') submission.status = 'completed';
            }

        }

        await submission.save();
        return NextResponse.json({ success: true, submission });

    } catch (error) {
        console.error('Update submission error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
