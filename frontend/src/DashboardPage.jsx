
// In your DashboardPage.jsx or similar file

import SummaryMetrics from './SummaryMetrics';
import ExpenseList from './ExpenseList';

export default function DashboardPage() {
    return (
        <div className="dashboard-layout">
            <SummaryMetrics />
            <ExpenseList />
        </div>
    );
}