import { Construction } from 'lucide-react'

export function meta() {
    return [
        { title: "Coming Soon - Sync" },
        { name: "description", content: "Dashboard" },
    ];
}

function Completed() {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center text-gray-600 p-6">
            <Construction className="w-16 h-16 text-yellow-500 mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Coming Soon</h2>
            <p className="text-base max-w-md">
                This section is under development and will be available in a future update.
            </p>
        </div>
    )
}

export default Completed