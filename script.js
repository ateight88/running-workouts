const state = {
  distanceKm: 5,
  unit: 'km',
  raceSeconds: 20 * 60,
  filter: 'all',
  paces: {}
};

const workouts = [
  {
    id: 'cruise-1k', category: 'threshold', tag: 'Threshold', difficulty: 'Medium',
    title: 'Cruise 1Ks', description: 'Accumulate threshold volume in repeatable blocks without letting the session become a race.',
    preview: '5–6 × 1 km · 60 sec float',
    warmup: '15–20 min easy + 4 × 20 sec strides.',
    main: ({ threshold }) => `5–6 × 1 km at ${threshold} pace with 60 sec very easy jog between reps.`,
    cooldown: '10–15 min easy.'
  },
  {
    id: 'norwegian-2k', category: 'threshold', tag: 'Threshold', difficulty: 'Hard',
    title: 'Controlled 2Ks', description: 'Long threshold repetitions that reward restraint. Keep every rep smooth and consistent.',
    preview: '4 × 2 km · 90 sec jog',
    warmup: '20 min easy + drills + 4 strides.',
    main: ({ threshold }) => `4 × 2 km at ${threshold} pace with 90 sec easy jog. Reduce to 3 reps if needed.`,
    cooldown: '15 min easy.'
  },
  {
    id: 'five-minute', category: 'vo2', tag: 'VO₂ max', difficulty: 'Hard',
    title: 'Five-Minute Repeats', description: 'A classic high-aerobic session: long enough to load the system, short enough to keep form intact.',
    preview: '5 × 5 min · 2 min jog',
    warmup: '20 min easy + 4 strides.',
    main: ({ interval }) => `5 × 5 min around ${interval} pace with 2 min easy jog. Aim for even effort rather than a fast first rep.`,
    cooldown: '15–20 min easy.'
  },
  {
    id: 'broken-3k', category: 'vo2', tag: 'VO₂ max', difficulty: 'Very hard',
    title: 'Broken 3K', description: 'Fast repetitions clustered into two blocks. Quality stays high because recovery is carefully rationed.',
    preview: '2 sets · 5 × 600 m',
    warmup: '20 min easy + drills + 4–6 strides.',
    main: ({ interval }) => `2 sets of 5 × 600 m at ${interval} pace. Jog 60 sec between reps and 3 min between sets.`,
    cooldown: '15 min easy.'
  },
  {
    id: 'speed-400', category: 'speed', tag: 'Speed', difficulty: 'Medium',
    title: 'Relaxed 400s', description: 'Fast but composed running with enough recovery to protect mechanics and keep the final rep sharp.',
    preview: '10–12 × 400 m · 200 m jog',
    warmup: '20 min easy + mobility + 6 strides.',
    main: ({ repetition }) => `10–12 × 400 m at ${repetition} pace with 200 m relaxed jog. Stop before form deteriorates.`,
    cooldown: '15 min easy.'
  },
  {
    id: 'hill-power', category: 'speed', tag: 'Speed', difficulty: 'Medium',
    title: 'Hill Power', description: 'Short hill repetitions develop force and mechanics without demanding exact track splits.',
    preview: '10 × 45 sec uphill · jog down',
    warmup: '20 min easy + drills + 4 strides.',
    main: () => '10 × 45 sec uphill at strong controlled effort. Jog easily back down and start each rep recovered enough to run tall.',
    cooldown: '15 min easy.'
  },
  {
    id: 'steady-long', category: 'aerobic', tag: 'Aerobic', difficulty: 'Medium',
    title: 'Progressive Long Run', description: 'Build endurance without turning the whole run into a workout. Progress only in the final third.',
    preview: '80–110 min · progressive finish',
    warmup: 'First 15 min deliberately relaxed.',
    main: ({ easy, steady }) => `Run mostly at ${easy} pace, then gradually progress toward ${steady} pace during the final 20–30 min.`,
    cooldown: 'Finish with 5–10 min very easy if needed.'
  },
  {
    id: 'easy-strides', category: 'aerobic', tag: 'Aerobic', difficulty: 'Easy',
    title: 'Easy + Strides', description: 'A low-cost session that maintains rhythm and speed while prioritizing recovery.',
    preview: '45–60 min easy · 6 strides',
    warmup: 'Start easier than your normal easy pace for 10 min.',
    main: ({ easy }) => `45–60 min around ${easy} pace, then 6 × 20 sec relaxed strides with full easy recovery.`,
    cooldown: '5 min walk or easy jog.'
  },
  {
    id: 'fartlek', category: 'vo2', tag: 'Mixed', difficulty: 'Medium',
    title: 'One-Minute Fartlek', description: 'A flexible speed session for road or trail where effort matters more than perfectly measured splits.',
    preview: '15 × 1 min on / 1 min off',
    warmup: '15–20 min easy + 4 strides.',
    main: ({ interval, easy }) => `15 × 1 min around ${interval} effort / 1 min easy around ${easy} effort. Keep the “on” minutes smooth.`,
    cooldown: '10–15 min easy.'
  }
];

const els = {
  form: document.querySelector('#paceForm'),
  hours: document.querySelector('#hours'),
  minutes: document.querySelector('#minutes'),
  seconds: document.querySelector('#seconds'),
  easy: document.querySelector('#easyPace'),
  steady: document.querySelector('#steadyPace'),
  threshold: document.querySelector('#thresholdPace'),
  interval: document.querySelector('#intervalPace'),
  repetition: document.querySelector('#repPace'),
  note: document.querySelector('#resultNote'),
  grid: document.querySelector('#workoutGrid'),
  template: document.querySelector('#workoutTemplate'),
  themeToggle: document.querySelector('#themeToggle')
};

function raceSecondsFromInputs() {
  return (Number(els.hours.value) || 0) * 3600 + (Number(els.minutes.value) || 0) * 60 + (Number(els.seconds.value) || 0);
}

// Riegel's formula is used to normalize results across distances.
function equivalent5kSeconds(distanceKm, seconds) {
  return seconds * Math.pow(5 / distanceKm, 1.06);
}

function calculatePaces() {
  const eq5k = equivalent5kSeconds(state.distanceKm, state.raceSeconds);
  const fiveKPace = eq5k / 5; // seconds/km

  // Practical bands derived from 5K pace. These are intentionally simple,
  // transparent training estimates rather than lab-based prescriptions.
  state.paces = {
    easy: [fiveKPace * 1.30, fiveKPace * 1.44],
    steady: [fiveKPace * 1.20, fiveKPace * 1.28],
    threshold: [fiveKPace * 1.04, fiveKPace * 1.08],
    interval: [fiveKPace * 0.96, fiveKPace * 1.00],
    repetition: [fiveKPace * 0.90, fiveKPace * 0.95]
  };
}

function unitFactor() { return state.unit === 'mi' ? 1.609344 : 1; }

function formatPace(secondsPerKm) {
  const seconds = Math.round(secondsPerKm * unitFactor());
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min}:${String(sec).padStart(2, '0')}`;
}

function formatRange(range) {
  return `${formatPace(range[0])}–${formatPace(range[1])}`;
}

function pacesForText() {
  const suffix = state.unit === 'mi' ? '/mi' : '/km';
  return {
    easy: `${formatRange(state.paces.easy)} ${suffix}`,
    steady: `${formatRange(state.paces.steady)} ${suffix}`,
    threshold: `${formatRange(state.paces.threshold)} ${suffix}`,
    interval: `${formatRange(state.paces.interval)} ${suffix}`,
    repetition: `${formatRange(state.paces.repetition)} ${suffix}`
  };
}

function formatRaceTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return h ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}` : `${m}:${String(s).padStart(2, '0')}`;
}

function raceLabel() {
  if (Math.abs(state.distanceKm - 21.0975) < .01) return 'half marathon';
  if (Math.abs(state.distanceKm - 42.195) < .01) return 'marathon';
  return `${state.distanceKm}K`;
}

function renderPaces() {
  els.easy.textContent = formatRange(state.paces.easy);
  els.steady.textContent = formatRange(state.paces.steady);
  els.threshold.textContent = formatRange(state.paces.threshold);
  els.interval.textContent = formatRange(state.paces.interval);
  els.repetition.textContent = formatRange(state.paces.repetition);
  const suffix = state.unit === 'mi' ? ' per mile' : ' per km';
  els.note.textContent = `Based on a ${formatRaceTime(state.raceSeconds)} ${raceLabel()}. Paces shown in minutes${suffix}. Training paces are practical estimates, not physiological test results.`;
}

function renderWorkouts() {
  els.grid.innerHTML = '';
  const textPaces = pacesForText();
  workouts
    .filter(w => state.filter === 'all' || w.category === state.filter)
    .forEach(workout => {
      const node = els.template.content.cloneNode(true);
      const card = node.querySelector('.workout-card');
      card.dataset.category = workout.category;
      node.querySelector('.workout-tag').textContent = workout.tag;
      node.querySelector('.difficulty').textContent = workout.difficulty;
      node.querySelector('.workout-title').textContent = workout.title;
      node.querySelector('.workout-description').textContent = workout.description;
      node.querySelector('.session-preview').textContent = workout.preview;
      node.querySelector('.warmup').innerHTML = `<b>WARM UP</b><p>${workout.warmup}</p>`;
      const mainText = workout.main(textPaces);
      node.querySelector('.mainset').innerHTML = `<b>MAIN SET</b><p>${mainText}</p>`;
      node.querySelector('.cooldown').innerHTML = `<b>COOL DOWN</b><p>${workout.cooldown}</p>`;

      const toggle = node.querySelector('.workout-toggle');
      const details = node.querySelector('.workout-details');
      toggle.addEventListener('click', () => {
        const open = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', String(!open));
        toggle.firstChild.textContent = open ? 'View session ' : 'Hide session ';
        details.hidden = open;
        card.classList.toggle('open', !open);
      });

      node.querySelector('.copy-button').addEventListener('click', async (event) => {
        const text = `${workout.title}\n\nWarm up: ${workout.warmup}\nMain set: ${mainText}\nCool down: ${workout.cooldown}`;
        try {
          await navigator.clipboard.writeText(text);
          event.currentTarget.textContent = 'Copied';
          setTimeout(() => event.currentTarget.textContent = 'Copy workout', 1300);
        } catch {
          event.currentTarget.textContent = 'Copy unavailable';
        }
      });

      els.grid.appendChild(node);
    });
}

function updateAll() {
  calculatePaces();
  renderPaces();
  renderWorkouts();
}

document.querySelectorAll('.distance-option').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.distance-option').forEach(b => b.classList.remove('active'));
    button.classList.add('active');
    state.distanceKm = Number(button.dataset.distance);
  });
});

document.querySelectorAll('.unit-btn').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.unit-btn').forEach(b => b.classList.remove('active'));
    button.classList.add('active');
    state.unit = button.dataset.unit;
    renderPaces();
    renderWorkouts();
  });
});

document.querySelectorAll('.filter-btn').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    button.classList.add('active');
    state.filter = button.dataset.filter;
    renderWorkouts();
  });
});

els.form.addEventListener('submit', event => {
  event.preventDefault();
  const seconds = raceSecondsFromInputs();
  if (seconds < 180) {
    els.note.textContent = 'Enter a valid race time of at least 3 minutes.';
    return;
  }
  state.raceSeconds = seconds;
  updateAll();
});

els.themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('tlp-theme', document.body.classList.contains('dark') ? 'dark' : 'light');
});

if (localStorage.getItem('tlp-theme') === 'dark') document.body.classList.add('dark');

updateAll();
