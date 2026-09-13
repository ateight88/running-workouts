const state = {
  distanceKm: 5,
  unit: 'km',
  raceSeconds: 20 * 60,
  filter: 'all',
  paces: {},
};

const workouts = [
  {
    id: 'jakob-am-threshold',
    category: 'threshold',
    tag: 'Threshold',
    difficulty: 'Hard',
    athlete: 'Jakob Ingebrigtsen',
    title: '5 × 6 min Threshold',
    description:
      'The morning half of the Ingebrigtsen-style double-threshold day: long, controlled repetitions with short recovery.',
    preview: '5 × 6 min · 2 min recovery',
    warmup: 'About 30 min easy running before the first interval.',
    main: ({ threshold }) =>
      `5 × 6 min at controlled threshold effort, around ${threshold}, with 2 min easy recovery between repetitions.`,
    cooldown: 'About 10 min easy running.',
    source: 'Göran Winblad — Ingebrigtsen Training Calculator',
  },
  {
    id: 'jakob-pm-threshold',
    category: 'threshold',
    tag: 'Threshold',
    difficulty: 'Very hard',
    athlete: 'Jakob Ingebrigtsen',
    title: '8 × 1 km Threshold',
    description:
      'The shorter, slightly quicker evening session from the double-threshold day. The key is control rather than racing the repetitions.',
    preview: '8 × 1 km · 1 min recovery',
    warmup: 'About 15 min easy running.',
    main: ({ threshold }) =>
      `8 × 1 km around ${threshold} with 1 min easy recovery between repetitions. Keep the pace repeatable from the first rep to the last.`,
    cooldown: 'About 15 min easy running.',
    source: 'Göran Winblad — Ingebrigtsen Training Calculator',
  },
  {
    id: 'kipchoge-15x1k',
    category: 'vo2',
    tag: 'Intervals',
    difficulty: 'Very hard',
    athlete: 'Eliud Kipchoge',
    title: '15 × 1 km',
    description:
      'A classic Kipchoge track session built around a large volume of fast kilometre repetitions.',
    preview: '15 × 1 km · 2 min jog',
    warmup: '3 km easy running before the session.',
    main: ({ interval }) =>
      `15 × 1 km around ${interval} with 2 min easy jogging recovery. Scale the number of repetitions down if this volume is beyond your normal training load.`,
    cooldown: '3 km easy running.',
    source: 'Eliud Kipchoge training documented and adapted by Göran Winblad',
  },
  {
    id: 'kipchoge-fast-float',
    category: 'threshold',
    tag: 'Fast / Float',
    difficulty: 'Very hard',
    athlete: 'Eliud Kipchoge',
    title: '12 × (1 km Fast + 1 km Float)',
    description:
      'A continuous alternating session: a fast kilometre followed by a controlled float kilometre, repeated without standing recovery.',
    preview: '12 × 1 km fast / 1 km float',
    warmup: '3 km easy running.',
    main: ({ interval, steady }) =>
      `12 rounds of 1 km fast around ${interval}, then 1 km float around ${steady}. The float is active running, not a recovery stop.`,
    cooldown: '3 km easy running.',
    source: 'Eliud Kipchoge training documented and adapted by Göran Winblad',
  },
  {
    id: 'kipchoge-5x3k',
    category: 'threshold',
    tag: 'Long Intervals',
    difficulty: 'Very hard',
    athlete: 'Eliud Kipchoge',
    title: '5 × 3 km',
    description:
      'Long sustained repetitions separated by a kilometre of easier running. This is a major endurance workout even for experienced runners.',
    preview: '5 × 3 km hard · 1 km easy',
    warmup: '3 km easy running.',
    main: ({ threshold, easy }) =>
      `5 × 3 km around ${threshold}, with 1 km easy running around ${easy} between repetitions. Consider 3–4 reps if you are not accustomed to this workload.`,
    cooldown: '3 km easy running.',
    source: 'Eliud Kipchoge training documented and adapted by Göran Winblad',
  },
  {
    id: 'kipchoge-ladder',
    category: 'speed',
    tag: 'Ladder',
    difficulty: 'Very hard',
    athlete: 'Eliud Kipchoge',
    title: '5K–3K–2K–1K + 4 × 200 m',
    description:
      'A descending-distance track session that moves from sustained work toward faster running at the end.',
    preview: '5K · 3K · 2K · 1K · 4 × 200 m',
    warmup: '3 km easy running.',
    main: ({ threshold, interval, repetition }) =>
      `Run 5 km and 3 km around ${threshold}, then 2 km and 1 km progressing toward ${interval}. Recover 5, 3, 2 and 1 min respectively, then finish with 4 × 200 m around ${repetition} with 200 m easy jog.`,
    cooldown: '3 km easy running.',
    source: 'Eliud Kipchoge training documented and adapted by Göran Winblad',
  },
  {
    id: 'kilian-vk10k',
    category: 'aerobic',
    tag: 'Mountain Challenge',
    difficulty: 'Extreme',
    athlete: 'Kilian Jornet',
    title: 'VK + 10K Challenge',
    description:
      'A famous mountain-to-road test: climb one vertical kilometre, descend, then run a flat 10K. This is a challenge rather than a routine weekly workout.',
    preview: '1,000 m vertical climb · descend · 10K',
    warmup:
      'Warm up thoroughly before the climb, including easy running and uphill mobility.',
    main: ({ threshold }) =>
      `Complete a route gaining 1,000 vertical metres, descend safely, then run 10 km at a strong sustainable effort. For a training version, aim around ${threshold} rather than attempting Jornet's all-out benchmark.`,
    cooldown:
      'Walk or jog very easily and allow substantial recovery afterward.',
    source: 'Kilian Jornet challenge replicated by Göran Winblad',
  },
];

// Additional sessions extracted from the Train Like the Pros workout data supplied by the user.
// Existing workouts above are intentionally preserved.
const goranWorkouts = [
  {
    id: 'josh-kerr-project-222',
    athlete: 'Josh Kerr',
    title: 'Project 222',
    subtitle: '4 × (200m + 600m + 200m)',
    purpose: 'Practise mile rhythm with a fast finish to each set.',
    category: 'mile_specific',
    surface: 'track',
    recovery:
      '90 seconds after the opening 200m, 60 seconds after the 600m, and 4:30 between complete sets.',
    appCategory: 'speed',
  },
  {
    id: 'marius-bakken-45-15',
    athlete: 'Marius Bakken',
    title: 'The Bakken 45/15',
    subtitle: '45 seconds on. 15 seconds to reset.',
    purpose: 'Accumulate controlled aerobic work in short, repeatable efforts.',
    category: 'threshold',
    surface: 'treadmill',
    recovery:
      '15 seconds standing or slow float recovery between every 45-second repetition. Ends immediately after final rep.',
    appCategory: 'threshold',
  },
  {
    id: 'jakob-25-400m',
    athlete: 'Jakob Ingebrigtsen',
    title: '25 × 400m',
    subtitle: 'Short recoveries. Consistent rhythm.',
    purpose: 'Hold a repeatable 5K–10K rhythm with short recoveries.',
    category: '10k',
    surface: 'track',
    recovery:
      'Strict 30 seconds standing or walking recovery between 400m repetitions.',
    appCategory: 'vo2',
  },
  {
    id: 'jakob-treadmill-threshold',
    athlete: 'Jakob Ingebrigtsen',
    title: '4 × 6-minute threshold',
    subtitle: 'Controlled work on the treadmill',
    purpose: 'Build aerobic endurance with steady, controlled blocks.',
    category: 'threshold',
    surface: 'treadmill',
    recovery:
      'The app suggests two minutes easy between six-minute efforts; the source does not specify recovery.',
    appCategory: 'threshold',
  },
  {
    id: 'jakob-norwegian-hills',
    athlete: 'Jakob Ingebrigtsen',
    title: 'Norwegian hill repeats',
    subtitle: '2 × 10 uphill 200s',
    purpose: 'Practise powerful, controlled uphill running.',
    category: 'hills',
    surface: 'rolling_hills',
    recovery:
      'Jog back down after each hill. Take 3–5 minutes between sets; the app uses four minutes.',
    appCategory: 'speed',
  },
  {
    id: 'eliud-kipchoge-13-1k',
    athlete: 'Eliud Kipchoge',
    title: 'Progressive 13 × 1K',
    subtitle: 'From 2:53 down to 2:45 at Kaptagat training camp',
    purpose: 'Build sustained interval rhythm with a gradual finish.',
    category: 'marathon',
    surface: 'track',
    recovery: '90 seconds walking and slow jogging recovery.',
    appCategory: 'threshold',
  },
  {
    id: 'eliud-kipchoge-30x1-fartlek',
    athlete: 'Eliud Kipchoge',
    title: 'One-minute fartlek',
    subtitle: '30 × 1 minute on / 1 minute easy',
    purpose: 'Change gears by feel over cross-country terrain.',
    category: 'fartlek',
    surface: 'cross_country',
    recovery: '1 minute easy jogging between hard 1-minute efforts.',
    appCategory: 'speed',
  },
  {
    id: 'eliud-kipchoge-alternations',
    athlete: 'Eliud Kipchoge',
    title: '2K / 1K track intervals',
    subtitle: '5 × (2K + 1K), with walk-jog recoveries',
    purpose: 'Link longer intervals with quicker kilometre repetitions.',
    category: 'marathon',
    surface: 'track',
    recovery:
      '100m walk + 100m jog between efforts. The displayed duration is approximate.',
    appCategory: 'threshold',
  },
  {
    id: 'eliud-kipchoge-4x10min-threshold',
    athlete: 'Eliud Kipchoge',
    title: '4 × 10-minute rolling tempo',
    subtitle: 'High-volume tempo intervals across rolling dirt roads',
    purpose: 'Build sustained aerobic effort on rolling ground.',
    category: 'threshold',
    surface: 'rolling_hills',
    recovery: '2 minutes slow jogging recovery.',
    appCategory: 'threshold',
  },
  {
    id: 'eliud-kipchoge-mixed-speed',
    athlete: 'Eliud Kipchoge',
    title: 'The mixed-speed session',
    subtitle: '1200m + 5 × 1K + 3 × 300m + 2 × 200m combo',
    purpose: 'Move from longer aerobic reps to relaxed speed.',
    category: 'mixed_speed',
    surface: 'track',
    recovery:
      'One easy lap jog between segments; 90s between 1K reps; 60s between 300m and 200m reps.',
    appCategory: 'speed',
  },
  {
    id: 'eliud-kipchoge-40k-longrun',
    athlete: 'Eliud Kipchoge',
    title: 'The long run',
    subtitle: 'A reduced version of the 40K session',
    purpose:
      'Develop sustained endurance within your established long-run range.',
    category: 'long_run',
    surface: 'rolling_hills',
    recovery:
      'Continuous running. Plan fluid and fuel access around the route and conditions.',
    appCategory: 'aerobic',
  },
  {
    id: 'andreas-almgren-6x6min',
    athlete: 'Andreas Almgren',
    title: '6 × 6-minute threshold',
    subtitle: 'Morning threshold foundation with precise lactate management',
    purpose: 'Accumulate aerobic work without chasing each split.',
    category: 'threshold',
    surface: 'road',
    recovery: '2 minutes easy jogging recovery as standard adaptation.',
    appCategory: 'threshold',
  },
  {
    id: 'andreas-almgren-20x400m',
    athlete: 'Andreas Almgren',
    title: '20 × 400m rhythm',
    subtitle:
      'Averaging 62.72s with 30s recovery and mid-session lactate pause',
    purpose: 'Practise steady turnover in two manageable blocks.',
    category: 'threshold',
    surface: 'track',
    recovery:
      'App suggestions: 30 seconds between reps and two minutes between sets.',
    appCategory: 'threshold',
  },
  {
    id: 'andreas-almgren-3x3k',
    athlete: 'Andreas Almgren',
    title: '3 × 3K sharpening',
    subtitle: '8:00, 7:52, and 7:43 at the tail end of a 170km week',
    purpose: 'Practise sustained, progressive race effort.',
    category: '10k',
    surface: 'track',
    recovery: '3 minutes standing or walking recovery between 3K efforts.',
    appCategory: 'vo2',
  },
  {
    id: 'andreas-almgren-10x1k',
    athlete: 'Andreas Almgren',
    title: '10 × 1K race check',
    subtitle: '10 × 1K with 60s rest, closing in 2:28.65 with ~162 bpm avg HR',
    purpose: 'Practise consistent race-specific rhythm.',
    category: 'race_primer',
    surface: 'track',
    recovery: 'Strict 60 seconds walking recovery between 1K reps.',
    appCategory: 'speed',
  },
  {
    id: 'andreas-almgren-5k-sharpening',
    athlete: 'Andreas Almgren',
    title: 'The sharpening ladder',
    subtitle: '3000m (7:40) + 1500m (3:43) + 5 × 300m (44s)',
    purpose: 'Build race rhythm, then finish with controlled speed.',
    category: '3k_5k',
    surface: 'track',
    recovery:
      'App suggestions: six minutes after the long opener, eight minutes after the middle rep, and one minute between 300s.',
    appCategory: 'vo2',
  },
  {
    id: 'grant-fisher-the-bookend',
    athlete: 'Grant Fisher',
    title: 'The Bookend',
    subtitle: '2000m (5:08) + 4 × 800m (2:06–2:09) + 1600m (4:00)',
    purpose: 'Practise a strong opening and a composed fast finish.',
    category: '3k_5k',
    surface: 'track',
    recovery:
      'App suggestions: generous recovery between the bookends and middle block, and 90 seconds between 800m reps.',
    appCategory: 'vo2',
  },
  {
    id: 'grant-fisher-4x2miles',
    athlete: 'Grant Fisher',
    title: '4 × 2-mile repeats',
    subtitle: '9:18, 9:26, 9:21, 9:14 with 2 minutes recovery',
    purpose: 'Build sustained rhythm for longer road races.',
    category: 'threshold',
    surface: 'track',
    recovery: 'Two minutes easy between reps is an app suggestion.',
    appCategory: 'threshold',
  },
  {
    id: 'nick-willis-the-michigan',
    athlete: 'Nick Willis',
    title: 'The Michigan',
    subtitle:
      'Classic Warhurst session: track reps alternating with 2K road tempos',
    purpose: 'Alternate track speed with sustained tempo running.',
    category: 'mixed_speed',
    surface: 'track',
    recovery:
      'The app suggests 400m easy jog transitions. Recovery distances and pace were not specified in the account.',
    appCategory: 'speed',
  },
  {
    id: 'faith-kipyegon-2k-1k-400',
    athlete: 'Faith Kipyegon',
    title: 'The Kipyegon progression',
    subtitle: '2K + 3 × 1K + 7 × 400m',
    purpose: 'Move from longer efforts to quicker track rhythm.',
    category: 'mixed_speed',
    surface: 'track',
    recovery:
      'Recoveries were not reported; the app proposes 3:00, 2:00 and 1:30 by section.',
    appCategory: 'speed',
  },
  {
    id: 'sifan-hassan-tempo-cutdown',
    athlete: 'Sifan Hassan',
    title: 'Tempo & 300m cutdowns',
    subtitle: '15 minutes controlled, 20 minutes harder, then 4×300m',
    purpose: 'Follow sustained aerobic work with relaxed turnover.',
    category: 'mixed_speed',
    surface: 'road',
    recovery: 'Recovery was not reported; app suggestions are clearly marked.',
    appCategory: 'speed',
  },
  {
    id: 'mo-farah-descending-ladder',
    athlete: 'Mo Farah',
    title: 'The descending ladder',
    subtitle: '1600–1200–1000–800–600–400–200 with one-lap jogs',
    purpose: 'Change gears from longer intervals to finishing speed.',
    category: 'mixed_speed',
    surface: 'track',
    recovery: 'One lap jog after each work repetition.',
    appCategory: 'speed',
  },
  {
    id: 'hicham-el-guerrouj-10x400-corrected',
    athlete: 'Hicham El Guerrouj',
    title: '10 × 400m speed endurance',
    subtitle: 'Ten very fast 400s with 30 seconds recovery',
    purpose: 'Practise fast, repeatable running with short recoveries.',
    category: 'mile_specific',
    surface: 'track',
    recovery: '30 seconds between repetitions.',
    appCategory: 'speed',
  },
  {
    id: 'mona-fartlek',
    athlete: 'Steve Moneghetti',
    title: 'The Mona Fartlek',
    subtitle: '2×90s, 4×60s, 4×30s, 4×15s with equal floats',
    purpose: 'Practise changes of pace in a compact 20-minute set.',
    category: 'fartlek',
    surface: 'road',
    recovery: 'Equal-duration controlled float after every hard effort.',
    appCategory: 'speed',
  },
  {
    id: 'zatopek-classic-interval-day',
    athlete: 'Emil Zátopek',
    title: 'Zátopek’s classic intervals',
    subtitle: 'A representative Zátopek interval session with 200m jogs',
    purpose: 'Accumulate controlled 200s and 400s with easy jogs.',
    category: 'mixed_speed',
    surface: 'track',
    recovery: '200m jogs between efforts.',
    appCategory: 'speed',
  },
  {
    id: 'canova-4x5k-specific',
    athlete: 'Renato Canova',
    title: 'Marathon reps & floats',
    subtitle: 'Long marathon-specific reps with 1K fast-float recoveries',
    purpose: 'Practise marathon rhythm with steady running between reps.',
    category: 'marathon',
    surface: 'road',
    recovery: '1K fast float, approximately 85–95% of marathon speed.',
    appCategory: 'threshold',
  },
  {
    id: 'lydiard-hill-circuit',
    athlete: 'Arthur Lydiard',
    title: 'Lydiard Hill Circuit',
    subtitle: 'Uphill resistance, flat jog, downhill stride, flat speed',
    purpose: 'Practise hill technique and relaxed leg speed.',
    category: 'hills',
    surface: 'rolling_hills',
    recovery:
      'Easy and downhill sections connect the circuit. The app also suggests three minutes easy between complete circuits.',
    appCategory: 'speed',
  },
  {
    id: 'igloi-morning-ladder',
    athlete: 'Mihály Iglói',
    title: 'Iglói Morning Ladder',
    subtitle: '2×100, 2×200, 2×300, 2×100, 2×60',
    purpose: 'Change rhythm through a light, varied interval ladder.',
    category: 'mixed_speed',
    surface: 'track',
    recovery:
      'Active recoveries were characteristic; 45 seconds is an app suggestion.',
    appCategory: 'speed',
  },
  {
    id: 'rudisha-400-300-primer',
    athlete: 'David Rudisha',
    title: 'Rudisha’s 400 / 300 session',
    subtitle: '55–52 second 400s, then 39–36 second 300s',
    purpose: 'Practise quick rhythm with a low-volume speed session.',
    category: 'race_primer',
    surface: 'track',
    recovery: 'Recovery was not reported; three minutes is an app suggestion.',
    appCategory: 'speed',
  },
  {
    id: 'paula-half-marathon-tempo',
    athlete: 'Paula Radcliffe',
    title: 'Half-marathon tempo',
    subtitle: '5–6 miles at half-marathon goal pace or slightly faster',
    purpose: 'Build confidence at a sustainable half-marathon rhythm.',
    category: 'threshold',
    surface: 'road',
    recovery: 'Continuous run.',
    appCategory: 'threshold',
  },
  {
    id: 'keely-hodgkinson-hill-repeats',
    athlete: 'Keely Hodgkinson',
    title: 'Keely’s hill repeats',
    subtitle: 'Powerful uphill 200s with generous active recovery',
    purpose: 'Practise powerful uphill running with generous recovery.',
    category: 'hills',
    surface: 'rolling_hills',
    recovery: '2–3 minutes active recovery.',
    appCategory: 'speed',
  },
  {
    id: 'bekele-8x400-200',
    athlete: 'Kenenisa Bekele',
    title: 'Bekele’s 400 / 200 pairs',
    subtitle: '8 × (400m + 200m) with 90–120s recovery',
    purpose: 'Link sustained speed with quick, relaxed 200s.',
    category: 'race_primer',
    surface: 'track',
    recovery: '90–120 seconds between every effort. The app uses 120 seconds.',
    appCategory: 'speed',
  },
  {
    id: 'haile-3x2k',
    athlete: 'Haile Gebrselassie',
    title: '2K track repeats',
    subtitle: 'An illustrative long-interval session',
    purpose: 'Build repeatable aerobic power over longer repetitions.',
    category: '3k_5k',
    surface: 'track',
    recovery: 'Three minutes between repetitions.',
    appCategory: 'vo2',
  },
  {
    id: 'grete-waitz-4x1k',
    athlete: 'Grete Waitz',
    title: 'Grete’s kilometre repeats',
    subtitle: '4 × 1K · one-minute recoveries',
    purpose: 'Build steady, controlled rhythm over kilometre reps.',
    category: '10k',
    surface: 'track',
    recovery:
      'One minute between reps is reported. The app suggests 10K effort; it is not Waitz’s reported pace.',
    appCategory: 'vo2',
  },
  {
    id: 'bernard-lagat-400s',
    athlete: 'Bernard Lagat',
    title: 'Lagat’s two sets of 400s',
    subtitle: '2 × 4 × 400m · relaxed track rhythm',
    purpose: 'Practise consistent turnover with a reset between sets.',
    category: '3k_5k',
    surface: 'track',
    recovery:
      '100m jogs (about 45s) and three minutes between sets are reported. Pace is an app estimate.',
    appCategory: 'vo2',
  },
  {
    id: 'joan-benoit-flow-miles',
    athlete: 'Joan Benoit Samuelson',
    title: 'The flow miles',
    subtitle: 'Five miles, each a little quicker',
    purpose: 'Build gradually from easy running into a steady finish.',
    category: 'long_run',
    surface: 'road',
    recovery:
      'Continuous progression. App paces progress from easy to estimated marathon pace; none are historical splits.',
    appCategory: 'aerobic',
  },
  {
    id: 'mara-yamauchi-short-hills',
    athlete: 'Mara Yamauchi',
    title: 'Ten-second hill efforts',
    subtitle: '5 × 10 seconds · walk back recovery',
    purpose: 'Practise short, crisp uphill efforts with full recovery.',
    category: 'hills',
    surface: 'rolling_hills',
    recovery:
      'Walk back fully between efforts. Two minutes is an app suggestion; take longer if needed.',
    appCategory: 'speed',
  },
];

function paceKeyForSourceCategory(category) {
  if (category === 'threshold' || category === 'marathon') return 'threshold';
  if (category === '10k' || category === '3k_5k') return 'interval';
  if (
    category === 'mile_specific' ||
    category === 'race_primer' ||
    category === 'mixed_speed' ||
    category === 'fartlek' ||
    category === 'hills'
  )
    return 'repetition';
  return 'steady';
}

workouts.push(
  ...goranWorkouts.map(w => ({
    id: `goran-${w.id}`,
    category: w.appCategory,
    tag: w.category.replaceAll('_', ' ').replace(/\b\w/g, c => c.toUpperCase()),
    difficulty: ['long_run'].includes(w.category)
      ? 'Moderate'
      : ['threshold', 'marathon', '10k'].includes(w.category)
        ? 'Hard'
        : 'Very hard',
    athlete: w.athlete,
    title: w.title,
    description:
      w.purpose ||
      `A ${w.surface.replaceAll('_', ' ')} session from the Train Like the Pros workout library.`,
    preview: w.subtitle,
    warmup:
      w.category === 'hills'
        ? '15–20 min easy running, then drills and a few short strides.'
        : '15–20 min easy running, then 3–4 relaxed strides before the first hard effort.',
    main: paces => {
      const key = paceKeyForSourceCategory(w.category);
      const target = paces[key];
      const paceNote =
        w.category === 'hills'
          ? 'Run the uphill efforts by strong, controlled effort rather than forcing a flat-road pace.'
          : `Use about ${target} as a scaled intensity guide where the session calls for sustained hard running.`;
      return `${w.title}: ${w.subtitle} ${w.recovery ? `Recovery: ${w.recovery}` : ''} ${paceNote}`;
    },
    cooldown:
      '10–20 min very easy running. Reduce the volume if this session is substantially larger than your normal workout load.',
    source: 'Workout structure from the app data.',
  })),
);

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
  themeToggle: document.querySelector('#themeToggle'),
};

function raceSecondsFromInputs() {
  return (
    (Number(els.hours.value) || 0) * 3600 +
    (Number(els.minutes.value) || 0) * 60 +
    (Number(els.seconds.value) || 0)
  );
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
    easy: [fiveKPace * 1.3, fiveKPace * 1.44],
    steady: [fiveKPace * 1.2, fiveKPace * 1.28],
    threshold: [fiveKPace * 1.04, fiveKPace * 1.08],
    interval: [fiveKPace * 0.96, fiveKPace * 1.0],
    repetition: [fiveKPace * 0.9, fiveKPace * 0.95],
  };
}

function unitFactor() {
  return state.unit === 'mi' ? 1.609344 : 1;
}

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
    repetition: `${formatRange(state.paces.repetition)} ${suffix}`,
  };
}

function formatRaceTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return h
    ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    : `${m}:${String(s).padStart(2, '0')}`;
}

function raceLabel() {
  if (Math.abs(state.distanceKm - 21.0975) < 0.01) return 'half marathon';
  if (Math.abs(state.distanceKm - 42.195) < 0.01) return 'marathon';
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
      node.querySelector('.athlete-name').textContent =
        `Inspired by ${workout.athlete}`;
      node.querySelector('.workout-description').textContent =
        workout.description;
      node.querySelector('.session-preview').textContent = workout.preview;
      node.querySelector('.warmup').innerHTML =
        `<b>WARM UP</b><p>${workout.warmup}</p>`;
      const mainText = workout.main(textPaces);
      node.querySelector('.mainset').innerHTML =
        `<b>MAIN SET</b><p>${mainText}</p>`;
      node.querySelector('.cooldown').innerHTML =
        `<b>COOL DOWN</b><p>${workout.cooldown}</p>`;
      node.querySelector('.source-note').textContent = workout.source;

      const toggle = node.querySelector('.workout-toggle');
      const details = node.querySelector('.workout-details');
      toggle.addEventListener('click', () => {
        const open = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', String(!open));
        toggle.firstChild.textContent = open
          ? 'View session '
          : 'Hide session ';
        details.hidden = open;
        card.classList.toggle('open', !open);
      });

      node
        .querySelector('.copy-button')
        .addEventListener('click', async event => {
          const text = `${workout.title} — inspired by ${workout.athlete}\n\nWarm up: ${workout.warmup}\nMain set: ${mainText}\nCool down: ${workout.cooldown}\n\nSource context: ${workout.source}`;
          try {
            await navigator.clipboard.writeText(text);
            event.currentTarget.textContent = 'Copied';
            setTimeout(
              () => (event.currentTarget.textContent = 'Copy workout'),
              1300,
            );
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
    document
      .querySelectorAll('.distance-option')
      .forEach(b => b.classList.remove('active'));
    button.classList.add('active');
    state.distanceKm = Number(button.dataset.distance);
  });
});

document.querySelectorAll('.unit-btn').forEach(button => {
  button.addEventListener('click', () => {
    document
      .querySelectorAll('.unit-btn')
      .forEach(b => b.classList.remove('active'));
    button.classList.add('active');
    state.unit = button.dataset.unit;
    renderPaces();
    renderWorkouts();
  });
});

document.querySelectorAll('.filter-btn').forEach(button => {
  button.addEventListener('click', () => {
    document
      .querySelectorAll('.filter-btn')
      .forEach(b => b.classList.remove('active'));
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
  localStorage.setItem(
    'tlp-theme',
    document.body.classList.contains('dark') ? 'dark' : 'light',
  );
});

if (localStorage.getItem('tlp-theme') === 'dark')
  document.body.classList.add('dark');

updateAll();
