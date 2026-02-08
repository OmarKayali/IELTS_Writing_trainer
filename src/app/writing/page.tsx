import WritingSession from '@/components/writing/WritingSession';
import { WRITING_TASKS } from '@/lib/ieltsPrompts';

export default function WritingPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-64px)]">
            <WritingSession tasks={WRITING_TASKS} />
        </div>
    );
}
