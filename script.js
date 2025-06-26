let workouts = [];

const caloriesEl = document.getElementById('calories');
const timeEl = document.getElementById('time');
const logList = document.getElementById('logList');
const tipText = document.getElementById('tipText');

const chartLabels = [];
const chartData = [];

const ctx = document.getElementById('progressChart').getContext('2d');
const progressChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: chartLabels,
    datasets: [{
      label: 'Calories Burned',
      data: chartData,
      backgroundColor: 'rgba(46, 204, 113, 0.7)',
      borderColor: '#27ae60',
      borderWidth: 1
    }]
  },
  options: {
    scales: {
      y: { beginAtZero: true }
    }
  }
});

function addWorkout() {
  const exercise = document.getElementById('exercise').value.trim();
  const duration = parseInt(document.getElementById('duration').value);

  if (!exercise || !duration || duration <= 0) {
    alert("Please enter a valid workout and duration.");
    return;
  }

  const calories = estimateCalories(exercise, duration);
  const today = new Date().toLocaleDateString();

  const workout = { exercise, duration, calories, date: today };
  workouts.push(workout);
  updateUI();
  document.getElementById('exercise').value = '';
  document.getElementById('duration').value = '';
}

function estimateCalories(exercise, duration) {
  const MET = 6;
  const weight = 70;
  return Math.round(MET * weight * (duration / 60));
}

function updateUI() {
  logList.innerHTML = '';
  let totalCalories = 0;
  let totalTime = 0;

  
  chartLabels.length = 0;
  chartData.length = 0;
  const caloriesByDate = {};

  workouts.forEach(workout => {
    
    const li = document.createElement('li');
    li.textContent = `${workout.date}: ${workout.exercise} - ${workout.duration} min = ${workout.calories} kcal`;
    logList.appendChild(li);

    
    totalCalories += workout.calories;
    totalTime += workout.duration;

    
    if (!caloriesByDate[workout.date]) {
      caloriesByDate[workout.date] = 0;
    }
    caloriesByDate[workout.date] += workout.calories;
  });

  for (const date in caloriesByDate) {
    chartLabels.push(date);
    chartData.push(caloriesByDate[date]);
  }

  caloriesEl.textContent = totalCalories;
  timeEl.textContent = totalTime;

  progressChart.update();
  localStorage.setItem("fitzone-workouts", JSON.stringify(workouts));
}


async function fetchTip() {
  try {
    const res = await fetch("https://api.adviceslip.com/advice");
    const data = await res.json();
    tipText.textContent = `"${data.slip.advice}"`;
  } catch {
    tipText.textContent = "Stay strong. Keep pushing!";
  }
}

fetchTip();
