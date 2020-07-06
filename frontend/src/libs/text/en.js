export default {
  app: {
    name: 'app'
  },
  languages: {
    ru: 'Русский',
    en: 'Английский'
  },
  months: Object.entries([
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь'
  ]).map(([value, name]) => ({ value, name })),
  menu: {
    home: 'Главная',
    users: 'Сотрудники',
    settings: 'Настройки',
    socialNetworks: 'Социальные сети',
    absenteeism: 'Пропуски',
    bonuses: 'Бонусы',
    employeePerformance: 'Оценка производительности',
    departments: 'Отделы',
    positions: 'Должности',
    expenses: 'Затраты',
    payrolls: 'Зарплата',
    rights: 'Права',
    roles: 'Роли'
  },
  actions: {
    title: 'Действия',
    update: 'Обновить',
    upload: 'Загрузить новую',
    delete: 'Удалить',
    add: 'Добавить',
    new: 'Новый',
    edit: 'Редактировать',
    send: 'Отправить',
    cancel: 'Отмена',
    ok: 'Ок',
    open: 'Открыть',
    salary: 'Зарплата'
  },
  filters: {
    email: 'E-Mail',
    firstName: 'Имя',
    lastName: 'Фамилия',
    phone: 'Телефон',
    positions: 'Должность',
    positionId: 'Должность',
    departments: 'Отдел',
    departmentId: 'Отдел',
    tags: 'Тег',
    skills: 'Навык',
    name: 'Название',
    month: 'Месяц',
    year: 'Год',
    type: 'Тип'
  },
  auth: {
    login: 'Вход'
  },
  users: {
    name: 'ФИО',
    phone: 'Телефон',
    avatar: 'Фото',
    email: 'E-Mail',
    password: 'Пароль',
    firstName: 'Имя',
    middleName: 'Отчество',
    lastName: 'Фамилия',
    bio: 'Описание',
    card: 'Номер карты',
    tags: 'Теги',
    skills: 'Навыки'
  },
  socialNetworks: {
    name: 'Название',
    image: 'Лого',
    link: 'Ссылка'
  },
  absenteeism: {
    reason: 'Причина',
    startDate: 'Дата начала',
    duration: 'Продолжительность'
  },
  bonuses: {
    name: 'Название',
    amount: 'Сумма',
    description: 'Описание'
  },
  employeePerformance: {
    status: 'Оценка',
    date: 'Дата'
  },
  departments: {
    name: 'Название',
    createdAt: 'Дата создания'
  },
  positions: {
    name: 'Название',
    minSalary: 'Минимальная зарплата',
    maxSalary: 'Максимальная зарплата',
    needWorkers: 'Нужны сотрудники',
    description: 'Описание'
  },
  expenses: {
    type: 'Тип',
    amount: 'Сумма',
    description: 'Описание'
  },
  payrolls: {
    amount: 'Сумма',
    type: 'Тип',
    createdAt: 'Дата',
    createdBy: 'Выдал',
    user: 'Получатель',
    types: {
      whiteSalary: 'Белая зарплата',
      blackSalary: 'Черная зарплата',
      bonus: 'Бонус'
    },
    period: 'Период',
    month: 'Месяц',
    year: 'Год',
    wage: 'Зарплата'
  },
  rights: {
    name: 'Название',
    description: 'Описание'
  },
  roles: {
    name: 'Название'
  },
  wages: {
    department: 'Отдел',
    position: 'Должность',
    user: 'Сотрудник',
    blackSalary: 'Зараплата (ч)',
    whiteSalary: 'Зарплата (б)',
    salary: 'Зарплата',
    paidSalary: 'Выплачено',
    remainingSalary: 'Осталось',
    status: 'Статус',
    statuses: {
      candidate: 'Кандидат',
      worker: 'Работает',
      fired: 'Уволен'
    }
  }
};
