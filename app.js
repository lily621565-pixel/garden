const cardEl = document.getElementById('card');
const storageKey = 'gardenSession';

const questions = [
  {
    id: 'Q1',
    text: '今天你走進一座花園，第一個會注意到什麼？',
    options: [
      { label: 'A', text: '哪裡看起來最乾、最需要水' },
      { label: 'B', text: '哪些地方長得太亂、不夠整齊' },
      { label: 'C', text: '有沒有哪株植物放錯了位置' },
      { label: 'D', text: '整體氛圍，好像少了點生氣' },
    ],
  },
  {
    id: 'Q2',
    text: '你想在花園裡做什麼？',
    options: [
      { label: 'A', text: '多澆點水、補點養分，讓它快點好起來' },
      { label: 'B', text: '整理一下，把看起來不太對的地方修好' },
      { label: 'C', text: '想想要不要換個配置，重新安排看看' },
      { label: 'D', text: '先坐下來看看，不急著動手' },
    ],
  },
  {
    id: 'Q3',
    text: '經過細心照料，但花園一直沒有開花，你會怎麼做？',
    options: [
      { label: 'A', text: '再調整配方，試試不同的養分' },
      { label: 'B', text: '回頭檢查，是不是哪裡做錯了' },
      { label: 'C', text: '思考是否該重新規劃整座花園' },
      { label: 'D', text: '接受現在的狀態，繼續等季節' },
    ],
  },
  {
    id: 'Q4',
    text: '你覺得現在這座花園，最需要什麼？',
    options: [
      { label: 'A', text: '空氣與間距，讓它能呼吸' },
      { label: 'B', text: '少一點干預，多一點耐心' },
      { label: 'C', text: '時間，讓根慢慢扎深' },
      { label: 'D', text: '穩定的照看，而不是急著成果' },
    ],
  },
];

const gardenerProfiles = {
  A: {
    name: '灌溉型主園丁',
    description: '水份與養分總能第一時間送達。你的心在土壤裡，願意給它所有能量。',
    task: '為自己泡一杯水或茶，慢慢喝完。把補給自己也放進日程。',
  },
  B: {
    name: '修剪型主園丁',
    description: '你擅長看見枝條的方向，懂得適度修整、讓能量回到主幹。',
    task: '丟掉一件累贅小物或待辦，留出一塊空白。',
  },
  C: {
    name: '移植型主園丁',
    description: '你思考動線與配置，願意搬移、重排，讓花園再次呼吸。',
    task: '換個座位或散步五分鐘，感受新的角度。',
  },
  D: {
    name: '守望型主園丁',
    description: '你耐心陪伴，願意用時間等候季節，讓花園自己說話。',
    task: '找一個可看天空的地方，靜坐三分鐘，觀察光線變化。',
  },
};

const wrapTexts = {
  blended: '這座花園正在換氣，兩種園丁輪流值班。沒有對錯，只有季節的節奏。',
  calm: '園丁下班，但花園仍在呼吸。你的心也可以。',
};

function loadSession() {
  const saved = localStorage.getItem(storageKey);
  if (!saved) return { answers: {}, stage: 'cover' };
  try {
    const parsed = JSON.parse(saved);
    return {
      answers: parsed.answers || {},
      stage: parsed.stage || 'cover',
    };
  } catch (err) {
    return { answers: {}, stage: 'cover' };
  }
}

function saveSession(data) {
  localStorage.setItem(storageKey, JSON.stringify(data));
}

function computeStage(session) {
  const answeredCount = Object.keys(session.answers).length;
  if (session.stage === 'wrap') return 'wrap';
  if (answeredCount >= questions.length) return 'result';
  if (answeredCount === 0) return 'cover';
  return 'question';
}

function renderCover() {
  const template = document.getElementById('cover-template');
  cardEl.innerHTML = template.innerHTML;
  const button = cardEl.querySelector('[data-action="start"]');
  button.addEventListener('click', () => {
    const session = loadSession();
    session.stage = 'question';
    saveSession(session);
    renderNextQuestion();
  });
}

function renderQuestion(index) {
  const question = questions[index];
  const template = document.getElementById('question-template');
  cardEl.innerHTML = template.innerHTML;

  const progress = cardEl.querySelector('.progress');
  progress.textContent = `第 ${index + 1} 題 / ${questions.length}`;
  cardEl.querySelector('.question').textContent = question.text;
  const optionsContainer = cardEl.querySelector('.options');

  question.options.forEach((opt) => {
    const btn = document.createElement('button');
    btn.className = 'primary';
    btn.textContent = `${opt.label} ｜ ${opt.text}`;
    btn.addEventListener('click', () => {
      const session = loadSession();
      session.answers[question.id] = opt.label;
      session.stage = 'question';
      saveSession(session);
      renderNextQuestion();
    });
    optionsContainer.appendChild(btn);
  });
}

function scoreAnswers(answers) {
  const counts = { A: 0, B: 0, C: 0, D: 0 };
  questions.forEach((q) => {
    const choice = answers[q.id];
    if (choice && counts[choice] !== undefined) counts[choice] += 1;
  });

  const max = Math.max(...Object.values(counts));
  const topKeys = Object.entries(counts)
    .filter(([, value]) => value === max && value > 0)
    .map(([key]) => key);

  return { counts, topKeys };
}

function renderResult() {
  const session = loadSession();
  const { counts, topKeys } = scoreAnswers(session.answers);
  const template = document.getElementById('result-template');
  cardEl.innerHTML = template.innerHTML;

  const badge = cardEl.querySelector('.badge');
  const desc = cardEl.querySelector('.description');
  const taskEl = cardEl.querySelector('.task');

  if (topKeys.length === 1) {
    const key = topKeys[0];
    const profile = gardenerProfiles[key];
    badge.textContent = profile.name;
    desc.textContent = profile.description;
    taskEl.textContent = profile.task;
  } else {
    const names = topKeys.map((key) => gardenerProfiles[key].name.replace('主', '')).join(' / ');
    badge.textContent = `輪值園丁：${names}`;
    desc.textContent = wrapTexts.blended;
    taskEl.textContent = '寫下兩個你想暫停的動作，選一個今天先不做。給花園留出空白。';
  }

  cardEl.querySelector('[data-action="wrap-up"]').addEventListener('click', () => {
    const s = loadSession();
    s.stage = 'wrap';
    saveSession(s);
    renderWrapUp();
  });

  cardEl.querySelector('[data-action="restart"]').addEventListener('click', restartFlow);
  cardEl.querySelector('[data-action="copy-link"]').addEventListener('click', copyLink);
  cardEl.querySelector('[data-action="copy-text"]').addEventListener('click', () => copyResultText(badge.textContent, desc.textContent, taskEl.textContent));
}

function renderWrapUp() {
  const template = document.getElementById('wrap-template');
  cardEl.innerHTML = template.innerHTML;
  cardEl.querySelector('[data-action="restart"]').addEventListener('click', restartFlow);
  cardEl.querySelector('[data-action="back-to-result"]').addEventListener('click', () => {
    const session = loadSession();
    session.stage = 'result';
    saveSession(session);
    renderResult();
  });
}

function renderNextQuestion() {
  const session = loadSession();
  const answeredCount = Object.keys(session.answers).length;
  if (answeredCount >= questions.length) {
    session.stage = 'result';
    saveSession(session);
    renderResult();
  } else {
    renderQuestion(answeredCount);
  }
}

function restartFlow() {
  localStorage.removeItem(storageKey);
  renderCover();
}

function copyLink() {
  if (!navigator.clipboard) {
    alert('此環境不支援複製功能，請手動複製網址。');
    return;
  }
  navigator.clipboard.writeText(window.location.href).then(() => {
    showToast('連結已複製');
  });
}

function copyResultText(title, desc, task) {
  if (!navigator.clipboard) {
    alert('此環境不支援複製功能，請手動複製文字。');
    return;
  }
  const text = `${title}\n${desc}\n核心提醒：你不需要只成為一種園丁。\n今日任務：${task}`;
  navigator.clipboard.writeText(text).then(() => {
    showToast('文字已複製');
  });
}

function showToast(message) {
  const note = document.createElement('div');
  note.className = 'toast';
  note.textContent = message;
  document.body.appendChild(note);
  setTimeout(() => note.classList.add('show'), 10);
  setTimeout(() => {
    note.classList.remove('show');
    setTimeout(() => note.remove(), 300);
  }, 1800);
}

function hydrateStage() {
  const session = loadSession();
  const stage = computeStage(session);
  if (stage === 'cover') {
    renderCover();
  } else if (stage === 'question') {
    renderNextQuestion();
  } else if (stage === 'result') {
    renderResult();
  } else if (stage === 'wrap') {
    renderWrapUp();
  }
}

hydrateStage();
