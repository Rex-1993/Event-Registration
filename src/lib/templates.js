export const STANDARD_TEMPLATES = {
  singing: {
    label: "歌唱比賽 (Singing Contest)",
    fields: [
      { id: "1", label: "姓名", type: "text", required: true },
      { id: "2", label: "性別", type: "radio", options: "男, 女", required: true },
      { id: "3", label: "歌名", type: "text", required: true },
      { id: "4", label: "原唱", type: "text", required: true },
      { id: "5", label: "歌曲編號", type: "text", required: false },
      { id: "6", label: "升降Key", type: "select", options: "原調, +1, +2, -1, -2", required: true },
      { id: "7", label: "電話", type: "text", required: true },
      { id: "8", label: "便當", type: "radio", options: "葷, 素", required: true },
      { id: "9", label: "伴唱機品牌", type: "select", options: "弘音, 音圓, 金嗓, 瑞影, 美華", required: true },
    ]
  },
  tour: {
    label: "遊覽車旅遊 (Bus Tour)",
    fields: [
      { id: "1", label: "姓名", type: "text", required: true },
      { id: "2", label: "身分證字號", type: "text", required: true },
      { id: "3", label: "生日", type: "date", required: true },
      { id: "4", label: "手機", type: "text", required: true },
      { id: "5", label: "緊急聯絡人/電話", type: "text", required: true },
      { id: "6", label: "上車地點", type: "radio", options: "地點A, 地點B, 自行前往", required: true },
      { id: "7", label: "房型", type: "select", options: "兩人房, 四人房, 單人房 (補差價)", required: true },
      { id: "8", label: "用餐", type: "radio", options: "葷, 素", required: true },
    ]
  },
  assembly: {
    label: "會員大會 (Member Assembly)",
    fields: [
      { id: "1", label: "會員編號", type: "text", required: true },
      { id: "2", label: "姓名", type: "text", required: true },
      { id: "3", label: "出席方式", type: "radio", options: "親自出席, 委託出席, 不克出席", required: true },
      { id: "4", label: "衣服尺寸", type: "select", options: "XS, S, M, L, XL, 2XL", required: true },
      { id: "5", label: "提案建議", type: "textarea", required: false },
    ]
  },
  workshop: {
    label: "研習講座 (Workshop)",
    fields: [
      { id: "1", label: "姓名", type: "text", required: true },
      { id: "2", label: "單位/職稱", type: "text", required: true },
      { id: "3", label: "Email", type: "text", required: true },
      { id: "4", label: "手機", type: "text", required: true },
      { id: "5", label: "用餐需求", type: "radio", options: "葷, 素, 不用餐", required: true },
      { id: "6", label: "提問", type: "textarea", required: false },
    ]
  },
  volunteer: {
    label: "志工服務 (Volunteer)",
    fields: [
      { id: "1", label: "姓名", type: "text", required: true },
      { id: "2", label: "性別", type: "radio", options: "男, 女", required: true },
      { id: "3", label: "身分證字號", type: "text", required: true },
      { id: "4", label: "手機", type: "text", required: true },
      { id: "5", label: "專長技能", type: "text", required: true },
      { id: "6", label: "可服務時段", type: "select", options: "平日上午, 平日下午, 假日全天", required: true },
    ]
  },
  reunion: {
    label: "同學會 (Reunion)",
    fields: [
      { id: "1", label: "姓名", type: "text", required: true },
      { id: "2", label: "畢業屆數/班級", type: "text", required: true },
      { id: "3", label: "攜伴人數", type: "select", options: "0, 1, 2, 3+", required: true },
      { id: "4", label: "手機", type: "text", required: true },
      { id: "5", label: "用餐", type: "radio", options: "葷, 素", required: true },
      { id: "6", label: "近況分享", type: "textarea", required: false },
    ]
  }
}
