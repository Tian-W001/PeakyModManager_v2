import * as fs from "fs";
import * as path from "path";

const CharacterInfo = {
  Unknown: {
    en: { fullname: "Unknown", nickname: "Unknown" },
    zh: { fullname: "未知角色", nickname: "未知角色" },
  },
  Belle: {
    en: { fullname: "Belle", nickname: "Belle" },
    zh: { fullname: "玲", nickname: "玲" },
  },
  Wise: {
    en: { fullname: "Wise", nickname: "Wise" },
    zh: { fullname: "哲", nickname: "哲" },
  },
  Anby: {
    en: { fullname: "Anby Demara", nickname: "Anby" },
    zh: { fullname: "安比·德玛拉", nickname: "安比" },
  },
  Billy: {
    en: { fullname: "Billy Kid", nickname: "Billy" },
    zh: { fullname: "比利·奇德", nickname: "比利" },
  },
  Nicole: {
    en: { fullname: "Nicole Demara", nickname: "Nicole" },
    zh: { fullname: "妮可·德玛拉", nickname: "妮可" },
  },
  Nekomata: {
    en: { fullname: "Nekomiya Mana", nickname: "Nekomata" },
    zh: { fullname: "猫宫又奈", nickname: "猫又" },
  },
  Koleda: {
    en: { fullname: "Koleda Belobog", nickname: "Koleda" },
    zh: { fullname: "柯蕾妲·贝洛伯格", nickname: "柯蕾妲" },
  },
  Ben: {
    en: { fullname: "Ben Bigger", nickname: "Ben" },
    zh: { fullname: "本·比格", nickname: "本" },
  },
  Grace: {
    en: { fullname: "Grace Howard", nickname: "Grace" },
    zh: { fullname: "格莉丝·霍华德", nickname: "格莉丝" },
  },
  Anton: {
    en: { fullname: "Anton Ivanov", nickname: "Anton" },
    zh: { fullname: "安东·伊万诺夫", nickname: "安东" },
  },
  Lycaon: {
    en: { fullname: "Von Lycaon", nickname: "Lycaon" },
    zh: { fullname: "冯·莱卡恩", nickname: "莱卡恩" },
  },
  Rina: {
    en: { fullname: "Alexandrina Sebastiane", nickname: "Rina" },
    zh: { fullname: "亚历山德丽娜·莎芭丝缇安", nickname: "丽娜" },
  },
  Corin: {
    en: { fullname: "Corin Wickes", nickname: "Corin" },
    zh: { fullname: "可琳·威克斯", nickname: "可琳" },
  },
  Soldier11: {
    en: { fullname: "Soldier 11", nickname: "Soldier11" },
    zh: { fullname: "「 11号 」", nickname: "11号" },
  },
  Soukaku: {
    en: { fullname: "Soukaku", nickname: "Soukaku" },
    zh: { fullname: "苍角", nickname: "苍角" },
  },
  Lucy: {
    en: { fullname: "Luciana de Montefio", nickname: "Lucy" },
    zh: { fullname: "露西亚娜·德·蒙特夫", nickname: "露西" },
  },
  Piper: {
    en: { fullname: "Piper Wheel", nickname: "Piper" },
    zh: { fullname: "派派·韦尔", nickname: "派派" },
  },
  Ellen: {
    en: { fullname: "Ellen Joe", nickname: "Ellen" },
    zh: { fullname: "艾莲·乔", nickname: "艾莲" },
  },
  ZhuYuan: {
    en: { fullname: "Zhu Yuan", nickname: "Zhu Yuan" },
    zh: { fullname: "朱鸢", nickname: "朱鸢" },
  },
  Qingyi: {
    en: { fullname: "Qingyi", nickname: "Qingyi" },
    zh: { fullname: "青衣", nickname: "青衣" },
  },
  Jane: {
    en: { fullname: "Jane Doe", nickname: "Jane" },
    zh: { fullname: "简·杜", nickname: "简" },
  },
  Seith: {
    en: { fullname: "Seith Lowell", nickname: "Seith" },
    zh: { fullname: "塞斯·洛威尔", nickname: "塞斯" },
  },
  Caesar: {
    en: { fullname: "Caesar King", nickname: "Caesar" },
    zh: { fullname: "凯撒·金", nickname: "凯撒" },
  },
  Burnice: {
    en: { fullname: "Burnice White", nickname: "Burnice" },
    zh: { fullname: "柏妮思·怀特", nickname: "柏妮思" },
  },
  Yanagi: {
    en: { fullname: "Tsukishiro Yanagi", nickname: "Yanagi" },
    zh: { fullname: "月城柳", nickname: "柳" },
  },
  Lighter: {
    en: { fullname: "Lighter", nickname: "Lighter" },
    zh: { fullname: "莱特", nickname: "莱特" },
  },
  Harumasa: {
    en: { fullname: "Asaba Harumasa", nickname: "Harumasa" },
    zh: { fullname: "浅羽悠真", nickname: "悠真" },
  },
  Miyabi: {
    en: { fullname: "Hoshimi Miyabi", nickname: "Miyabi" },
    zh: { fullname: "星见雅", nickname: "雅" },
  },
  Astra: {
    en: { fullname: "Astra Yao", nickname: "Astra" },
    zh: { fullname: "耀佳音", nickname: "耀佳音" },
  },
  Evelyn: {
    en: { fullname: "Evelyn Chevalier", nickname: "Evelyn" },
    zh: { fullname: "伊芙琳·舒瓦利耶", nickname: "伊芙琳" },
  },
  Pulchra: {
    en: { fullname: "Pulchra Fellini", nickname: "Pulchra" },
    zh: { fullname: "波可娜·费雷尼", nickname: "波可娜" },
  },
  Anby0: {
    en: { fullname: "Soldier 0 - Anby", nickname: "Anby0" },
    zh: { fullname: "零号·安比", nickname: "零号安比" },
  },
  Trigger: {
    en: { fullname: "Trigger", nickname: "Trigger" },
    zh: { fullname: "「 扳机 」", nickname: "扳机" },
  },
  Hugo: {
    en: { fullname: "Hugo", nickname: "Hugo" },
    zh: { fullname: "雨果", nickname: "雨果" },
  },
  Vivian: {
    en: { fullname: "Vivian Banshee", nickname: "Vivian" },
    zh: { fullname: "薇薇安·班希", nickname: "薇薇安" },
  },
  YiXuan: {
    en: { fullname: "Yi Xuan", nickname: "YiXuan" },
    zh: { fullname: "仪玄", nickname: "仪玄" },
  },
  PanYinhu: {
    en: { fullname: "Pan Yinhu", nickname: "PanYinhu" },
    zh: { fullname: "潘引壶", nickname: "潘引壶" },
  },
  JuFufu: {
    en: { fullname: "Ju Fufu", nickname: "Jufufu" },
    zh: { fullname: "橘福福", nickname: "橘福福" },
  }
};

function generateOutputInfoList(characterInfoList) {
  const characterList = [];
  const translationList = {
    en: {
      fullnames: {},
      nicknames: {},
    },
    zh: {
      fullnames: {},
      nicknames: {},
    },
  };
  
  for (const [nameKey, translations] of Object.entries(characterInfoList)) {
    characterList.push(nameKey);
    translationList.en.Fullnames[nameKey] = translations.en.fullname;
    translationList.en.Nicknames[nameKey] = translations.en.nickname;
    translationList.zh.Fullnames[nameKey] = translations.zh.fullname;
    translationList.zh.Nicknames[nameKey] = translations.zh.nickname;
  }

  return {characterList, translationList};
}

function createJSON(data) {
  fs.writeFileSync(METADATA_FILENAME, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`✅ charactersMetadata.json has been saved`);
}

const METADATA_FILENAME = "CharacterInfoList.json";
const {characterList, translationList} = generateOutputInfoList(CharacterInfo);
createJSON({characterList, translationList});

