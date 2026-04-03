import WorkoutActivityChart from "./WorkoutActivityChart";
import CalorieTrendChart from "./CalorieTrendChart";
import WeightBmiProgressChart from "./WeightBmiProgressChart";
import MacronutrientBreakdownChart from "./MacronutrientBreakdownChart";

function DashboardCharts({ last7Days, weightData, macroData, totalMacros }) {
  return (
    <>
      <div>
        <div className="grid gap-4 lg:grid-cols-2">
          <WorkoutActivityChart data={last7Days} />
          <CalorieTrendChart data={last7Days} />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <WeightBmiProgressChart data={weightData} />
        <MacronutrientBreakdownChart data={macroData} totalMacros={totalMacros} />
      </div>
    </>
  );
}

export default DashboardCharts;