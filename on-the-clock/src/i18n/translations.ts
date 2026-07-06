import type { Language } from '../types'

type LabelKey =
  | 'appTitle'
  | 'setup'
  | 'timer'
  | 'result'
  | 'history'
  | 'salary'
  | 'monthly'
  | 'annual'
  | 'hourly'
  | 'daysPerMonth'
  | 'hoursPerDay'
  | 'hoursPerWeek'
  | 'weeksPerYear'
  | 'monthlyScheduleTitle'
  | 'annualScheduleTitle'
  | 'hourlyScheduleNote'
  | 'ratePerMinute'
  | 'start'
  | 'stop'
  | 'share'
  | 'back'
  | 'todayTotal'
  | 'salaryRequired'
  | 'hourlyRequired'
  | 'scheduleRequired'
  | 'elapsed'
  | 'stolenAmount'
  | 'startFromSetup'
  | 'goSetup'
  | 'placeholder'
  | 'resultTitle'
  | 'sessionTime'
  | 'sessionAmount'
  | 'todayCumulative'
  | 'viewRecords'
  | 'viewMore'
  | 'continueSlacking'
  | 'copied'
  | 'todayRecords'
  | 'noRecordsToday'
  | 'recordEntry'
  | 'noSessionYet'
  | 'goTimer'
  | 'endSlacking'
  | 'pause'
  | 'prevStep'
  | 'nextStep'
  | 'clearRecords'
  | 'clearRecordsConfirm'
  | 'bossAlert'
  | 'bossAllClear'
  | 'reconfigureSalary'
  | 'setupIntro'
  | 'setupTitle'
  | 'setupStep1'
  | 'setupStep2'
  | 'setupStep3'
  | 'setupStep4'
  | 'startTimer'
  | 'timerTapHint'
  | 'timerEndHint'
  | 'stopwatchLabel'
  | 'timerRunning'
  | 'timerPaused'
  | 'startTimerAria'
  | 'pauseTimerAria'
  | 'selectCurrency'
  | 'setupHeroTitle'
  | 'setupCatQuote'
  | 'setupStartBurst'
  | 'setupInputArrow'
  | 'setupStepsTitle'
  | 'timerCatQuote'
  | 'timerMoneyBurst'
  | 'resultCatQuote'
  | 'resultBurst'
  | 'historyTitle'
  | 'historyCatQuote'
  | 'tabTodayRecords'
  | 'tabAllTimeRecords'
  | 'achievement'
  | 'achievementTitle'
  | 'tabMonthAchievement'
  | 'tabAllTimeAchievement'
  | 'bestSingleMonth'
  | 'monthTotal'
  | 'bestSingleAllTime'
  | 'allTimeTotal'
  | 'noData'
  | 'viewDetailRecords'

export const labelColors: string[] = ['#000000', '#000000', '#000000', '#000000', '#000000']

export const translations: Record<Language, Record<LabelKey, string>> = {
  en: {
    appTitle: 'On The Clock',
    setup: 'Setup',
    timer: 'Timer',
    result: 'Result',
    history: 'History',
    salary: 'Salary',
    monthly: 'Monthly',
    annual: 'Annual',
    hourly: 'Hourly',
    daysPerMonth: 'Days / Month',
    hoursPerDay: 'Hours / Day',
    hoursPerWeek: 'Hours / Week',
    weeksPerYear: 'Weeks / Year',
    monthlyScheduleTitle: 'Work schedule',
    annualScheduleTitle: 'Work hours (for conversion)',
    hourlyScheduleNote: 'Hourly rate — no schedule needed',
    ratePerMinute: 'Rate / min',
    start: 'START',
    stop: 'STOP',
    share: 'Share',
    back: 'Back',
    todayTotal: "Today's Total",
    salaryRequired: 'Enter your salary',
    hourlyRequired: 'Enter your hourly rate',
    scheduleRequired: 'Fill in your work schedule',
    elapsed: 'Elapsed',
    stolenAmount: 'Stolen',
    startFromSetup: 'Start from Setup first',
    goSetup: 'Go to Setup',
    placeholder: 'Foundation ready. Page UI coming next.',
    resultTitle: "Today's Slacking Score!",
    sessionTime: 'Time',
    sessionAmount: 'Amount',
    todayCumulative: "Today's Score",
    viewRecords: "Today's Records",
    viewMore: 'View all',
    continueSlacking: 'Keep Going',
    copied: 'Copied!',
    todayRecords: "Today's Records",
    noRecordsToday: 'No records yet today',
    recordEntry: 'Session',
    noSessionYet: 'No slacking session yet. Start the timer first!',
    goTimer: 'Go to Timer',
    endSlacking: 'End Slacking',
    pause: 'Pause',
    prevStep: 'Back',
    nextStep: 'Next',
    clearRecords: 'Clear All',
    clearRecordsConfirm: 'Clear all records for today?',
    bossAlert: 'Boss alert',
    bossAllClear: 'Back to Work',
    reconfigureSalary: 'Reconfigure Salary',
    setupTitle: "Let's price your slacking!",
    setupIntro: 'Enter your salary, hit Start slacking, and see how much you "earned" while slacking.',
    setupStep1: 'Enter your salary below (work hours are optional)',
    setupStep2: 'Tap Start slacking to open the timer',
    setupStep3: 'Press ▶ while slacking, End when you are done',
    setupStep4: 'Open Result to see today\'s score',
    startTimer: 'Start slacking',
    timerTapHint: 'Press ▶ to start the clock',
    timerEndHint: 'Start the timer before you can end',
    stopwatchLabel: 'Timer',
    timerRunning: 'running',
    timerPaused: 'paused',
    startTimerAria: 'Start timer',
    pauseTimerAria: 'Pause timer',
    selectCurrency: 'Select currency',
    setupHeroTitle: 'STEAL THE CLOCK',
    setupCatQuote: 'work again...? meh.',
    setupStartBurst: 'GO!!',
    setupInputArrow: 'type it here',
    setupStepsTitle: 'THE PLAN',
    timerCatQuote: 'stealing time... shhh',
    timerMoneyBurst: 'cha-ching!',
    resultCatQuote: 'we won today.',
    resultBurst: 'NICE!!',
    historyTitle: 'My Records',
    historyCatQuote: 'counting again... ugh',
    tabTodayRecords: 'Today',
    tabAllTimeRecords: 'All Time Records',
    achievement: 'Achievements',
    achievementTitle: 'My Achievements',
    tabMonthAchievement: 'This Month',
    tabAllTimeAchievement: 'All Time',
    bestSingleMonth: 'Best Single',
    monthTotal: 'Month Total',
    bestSingleAllTime: 'All-Time Best',
    allTimeTotal: 'Lifetime Total',
    noData: 'No data yet',
    viewDetailRecords: 'View Records'
  },
  zh: {
    appTitle: '薪水小偷',
    setup: '設定',
    timer: '計時',
    result: '結果',
    history: '紀錄',
    salary: '薪資',
    monthly: '月薪',
    annual: '年薪',
    hourly: '時薪',
    daysPerMonth: '每月天數',
    hoursPerDay: '每天工時',
    hoursPerWeek: '每週工時',
    weeksPerYear: '每年工作週數',
    monthlyScheduleTitle: '工時設定',
    annualScheduleTitle: '換算用工時',
    hourlyScheduleNote: '時薪不用填工時',
    ratePerMinute: '每分鐘薪資',
    start: '開始',
    stop: '停止',
    share: '分享',
    back: '返回',
    todayTotal: '今日總計',
    salaryRequired: '請輸入薪資',
    hourlyRequired: '請輸入時薪',
    scheduleRequired: '請填寫工時設定',
    elapsed: '已過時間',
    stolenAmount: '偷到金額',
    startFromSetup: '請先從設定頁開始',
    goSetup: '前往設定',
    placeholder: '基礎架構已完成，下一步逐頁製作。',
    resultTitle: '今天摸魚成績！',
    sessionTime: '時間',
    sessionAmount: '金額',
    todayCumulative: '今天戰績',
    viewRecords: '查看今日紀錄',
    viewMore: '查看更多',
    continueSlacking: '繼續摸魚',
    copied: '已複製！',
    todayRecords: '今日摸魚紀錄',
    noRecordsToday: '今天還沒有紀錄',
    recordEntry: '第',
    noSessionYet: '還沒有摸魚紀錄，先去計時吧！',
    goTimer: '前往計時',
    endSlacking: '結束摸魚',
    pause: '暫停',
    prevStep: '返回上一步',
    nextStep: '下一步',
    clearRecords: '清空紀錄',
    clearRecordsConfirm: '確定要清空今天的所有摸魚紀錄嗎？',
    bossAlert: '老闆來了',
    bossAllClear: '老闆走了',
    reconfigureSalary: '重新設定薪資',
    setupTitle: '先算算摸魚價值！',
    setupIntro: '輸入薪資、按開始摸魚，看看偷了多少薪水。',
    setupStep1: '在下方輸入薪資（工時預設可不改）',
    setupStep2: '按「開始摸魚」進入計時頁',
    setupStep3: '摸魚時按 ▶ 計時，結束按「結束摸魚」',
    setupStep4: '到「結果」看今天戰績，可分享或查紀錄',
    startTimer: '開始摸魚',
    timerTapHint: '按 ▶ 開始計時',
    timerEndHint: '開始計時後才能結束摸魚',
    stopwatchLabel: '計時器',
    timerRunning: '計時中',
    timerPaused: '已暫停',
    startTimerAria: '開始計時',
    pauseTimerAria: '暫停計時',
    selectCurrency: '選擇幣別',
    setupHeroTitle: '偷走你的薪水',
    setupCatQuote: '又要上班喔…隨便啦',
    setupStartBurst: '衝啊！！',
    setupInputArrow: '填這裡啦',
    setupStepsTitle: '摸魚攻略',
    timerCatQuote: '偷時間中…噓',
    timerMoneyBurst: '入袋啦！',
    resultCatQuote: '今天贏麻了',
    resultBurst: '讚啦！！',
    historyTitle: '我的紀錄',
    historyCatQuote: '又在對帳…累',
    tabTodayRecords: '本日紀錄',
    tabAllTimeRecords: '全時間紀錄',
    achievement: '戰績',
    achievementTitle: '我的戰績',
    tabMonthAchievement: '本月戰績',
    tabAllTimeAchievement: '累計戰績',
    bestSingleMonth: '最佳單次',
    monthTotal: '本月累計',
    bestSingleAllTime: '全時間最高',
    allTimeTotal: '累計總金額',
    noData: '暫無數據',
    viewDetailRecords: '查看詳細紀錄'
  }
}
