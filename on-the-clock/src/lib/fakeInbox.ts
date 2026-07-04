import type { Language } from '../types'

export interface FakeEmail {
  id: string
  sender: string
  subject: string
  preview: string
  time: string
  unread?: boolean
}

const emails: Record<Language, FakeEmail[]> = {
  zh: [
    {
      id: '1',
      sender: '王經理',
      subject: 'Re: Q2 專案進度同步',
      preview: '請在今天下班前更新週報，謝謝配合。',
      time: '10:42',
      unread: true
    },
    {
      id: '2',
      sender: '人資部',
      subject: '【提醒】本月出勤紀錄確認',
      preview: '請於 6/30 前完成系統確認，逾期將影響薪資結算。',
      time: '09:15',
      unread: true
    },
    {
      id: '3',
      sender: 'IT 服務台',
      subject: 'VPN 憑證即將到期',
      preview: '您的遠端連線憑證將於 7 天後到期，請儘早更新。',
      time: '昨天',
      unread: false
    },
    {
      id: '4',
      sender: '財務部',
      subject: '差旅費報銷流程調整通知',
      preview: '自 7/1 起，所有報銷需附上電子發票證明聯影本。',
      time: '昨天',
      unread: false
    },
    {
      id: '5',
      sender: '專案管理室',
      subject: '週會議程 — 6/26 14:00',
      preview: '議程：1. 進度檢核 2. 風險項目 3. 資源調配',
      time: '週三',
      unread: false
    },
    {
      id: '6',
      sender: '李副理',
      subject: 'Fwd: 客戶會議紀錄',
      preview: '麻煩確認附件中的 action items，週五前回覆。',
      time: '週二',
      unread: false
    }
  ],
  en: [
    {
      id: '1',
      sender: 'Sarah Mitchell',
      subject: 'Re: Q2 Project Status Update',
      preview: 'Please update the weekly report before EOD. Thanks.',
      time: '10:42 AM',
      unread: true
    },
    {
      id: '2',
      sender: 'HR Department',
      subject: 'Reminder: Timesheet Approval',
      preview: 'Please confirm your hours in the system by June 30.',
      time: '9:15 AM',
      unread: true
    },
    {
      id: '3',
      sender: 'IT Helpdesk',
      subject: 'VPN Certificate Expiring Soon',
      preview: 'Your remote access certificate expires in 7 days.',
      time: 'Yesterday',
      unread: false
    },
    {
      id: '4',
      sender: 'Finance Team',
      subject: 'Updated Expense Reimbursement Policy',
      preview: 'Effective July 1, all claims require digital receipt uploads.',
      time: 'Yesterday',
      unread: false
    },
    {
      id: '5',
      sender: 'PMO',
      subject: 'Weekly Sync — Thu 2:00 PM',
      preview: 'Agenda: 1. Status check 2. Risks 3. Resource planning',
      time: 'Wed',
      unread: false
    },
    {
      id: '6',
      sender: 'David Chen',
      subject: 'Fwd: Client Meeting Notes',
      preview: 'Please review the action items in the attachment by Friday.',
      time: 'Tue',
      unread: false
    }
  ]
}

export function getFakeEmails(language: Language): FakeEmail[] {
  return emails[language]
}
