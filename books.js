/**
 * LLTP Archive · 书籍数据（核心板块）
 * ------------------------------------------------------------
 * 本文件是网站的唯一书籍数据来源，请在 README.md 的方法指引下维护。
 * 电影数据是**独立文件** movies.js，字段与本文件不同，请勿混用。
 *
 * 数据说明（请务必先读再改）：
 * - 书名 / 作者 / 期数，来自粉丝整理的 LLTP 期数表（#1–#28）。
 * - doubanUrl 与 chineseEdition 中的出版社 / 译者信息，来自豆瓣条目页本人核对
 *   （book.douban.com，2026-10 核实）。
 * - 不含任何「Lily 说过的话」；引用她的话必须回原始直播或采访核对。
 * - 未核实或暂缺的字段一律留空字符串 "" 或 null，绝不编造。
 * - cover：本项目未内置真实封面图，留空即由前端自动绘制排版封面。
 * - xiaohongshuUrl：目前没有已发布的小红书链接，全部留空，页面显示「带读笔记暂未发布 / 链接待补」。
 *
 * verificationStatus 取值：
 *   "confirmed"    已核对：期数与作品对应关系清晰，来源为粉丝整理期数表
 *   "needs-review" 待核对：作品存在，但期数或译名尚未核实
 *
 * 关联规则：episodeIds ↔ episodes.js 的 bookIds（双向对应）。
 * 一本书可以同时关联多期（如《了不起的盖茨比》）。
 */
window.BOOKS = [
  {
    id: "book-001",
    title: "哈利·波特与魔法石",
    originalTitle: "Harry Potter and the Philosopher's Stone",
    author: "J.K. 罗琳",
    cover: "",
    doubanUrl: "https://book.douban.com/subject/1041007/",
    chineseEdition: { hasSimplifiedChinese: true, publisher: "人民文学出版社", translator: "", editionNote: "人民文学出版社 2000 年简体版（豆瓣评价最多）", sourceUrl: "" },
    episodeIds: ["episode-001"],
    tags: ["奇幻", "成长", "系列"],
    summary: "J.K. 罗琳的奇幻系列首作，讲述哈利进入霍格沃茨魔法学校的第一年。",
    verificationStatus: "confirmed",
    sources: [
      { label: "粉丝整理 LLTP 期数表", url: "" },
      { label: "豆瓣条目页", url: "https://book.douban.com/subject/1041007/" }
    ],
    xiaohongshuUrl: "",
    xiaohongshuNoteTitle: "",
    lastVerified: "2026-10-15",
    lastUpdated: "",
    note: "本记录为系列第一册；第 1 期聊的是整个哈利·波特系列。",
    adaptations: [
      { title: "哈利·波特与魔法石", year: 2001, form: "电影", doubanUrl: "https://movie.douban.com/subject/1295038/" }
    ],
    editions: [],
    imageSource: "",
    rightsStatus: "placeholder",
    licenseNote: ""
  },
  {
    id: "book-002",
    title: "周四推理俱乐部",
    originalTitle: "The Thursday Murder Club",
    author: "理查德·奥斯曼",
    cover: "",
    doubanUrl: "https://book.douban.com/subject/35762678/",
    chineseEdition: { hasSimplifiedChinese: true, publisher: "接力出版社", translator: "", editionNote: "简体中文版名为《周四推理俱乐部》", sourceUrl: "" },
    episodeIds: ["episode-004"],
    tags: ["推理", "系列"],
    summary: "理查德·奥斯曼的推理小说，四位养老社区老人组成业余侦探团，联手调查连环命案。",
    verificationStatus: "confirmed",
    sources: [
      { label: "粉丝整理 LLTP 期数表", url: "" },
      { label: "豆瓣条目页", url: "https://book.douban.com/subject/35762678/" }
    ],
    xiaohongshuUrl: "",
    xiaohongshuNoteTitle: "",
    lastVerified: "2026-10-15",
    lastUpdated: "",
    note: "系列第一部；该系列中文版共四本，第 4 期讲的是第一本。",
    adaptations: [
      { title: "周四推理俱乐部", year: 2025, form: "电影", doubanUrl: "https://movie.douban.com/subject/36767890/" }
    ],
    editions: [],
    imageSource: "",
    rightsStatus: "placeholder",
    licenseNote: ""
  },
  {
    id: "book-004",
    title: "当怪物来敲门",
    originalTitle: "A Monster Calls",
    author: "派崔克·奈斯",
    cover: "",
    doubanUrl: "https://book.douban.com/subject/35498018/",
    chineseEdition: { hasSimplifiedChinese: true, publisher: "新蕾出版社", translator: "", editionNote: "简体中文版名为《当怪物来敲门》", sourceUrl: "" },
    episodeIds: ["episode-006"],
    tags: ["奇幻", "成长"],
    summary: "派崔克·奈斯的成长小说，少年康纳在母亲病重时，遇见每晚来访的树怪。",
    verificationStatus: "confirmed",
    sources: [
      { label: "粉丝整理 LLTP 期数表", url: "" },
      { label: "豆瓣条目页", url: "https://book.douban.com/subject/35498018/" }
    ],
    xiaohongshuUrl: "",
    xiaohongshuNoteTitle: "",
    lastVerified: "2026-10-15",
    lastUpdated: "",
    note: "另译《怪物来敲门》。",
    adaptations: [
      { title: "当怪物来敲门", year: 2016, form: "电影", doubanUrl: "https://movie.douban.com/subject/25872311/" }
    ],
    editions: [],
    imageSource: "",
    rightsStatus: "placeholder",
    licenseNote: ""
  },
  {
    id: "book-005",
    title: "偷书贼",
    originalTitle: "The Book Thief",
    author: "马克斯·苏萨克",
    cover: "",
    doubanUrl: "https://book.douban.com/subject/30225784/",
    chineseEdition: { hasSimplifiedChinese: true, publisher: "北京十月文艺出版社", translator: "", editionNote: "2018 年简体版（豆瓣评价最多）", sourceUrl: "" },
    episodeIds: ["episode-008"],
    tags: ["历史", "战争"],
    summary: "马克斯·苏萨克的小说，以二战德国为背景，讲述女孩莉赛尔靠偷书与文字活下来。",
    verificationStatus: "confirmed",
    sources: [
      { label: "粉丝整理 LLTP 期数表", url: "" },
      { label: "豆瓣条目页", url: "https://book.douban.com/subject/30225784/" }
    ],
    xiaohongshuUrl: "",
    xiaohongshuNoteTitle: "",
    lastVerified: "2026-10-15",
    lastUpdated: "",
    note: "",
    adaptations: [
      { title: "偷书贼", year: 2013, form: "电影", doubanUrl: "https://movie.douban.com/subject/21348876/" }
    ],
    editions: [
      { publisher: "南海出版公司", translator: "孙张静", year: 2007, doubanUrl: "https://book.douban.com/subject/2180619/" },
      { publisher: "北京十月文艺出版社", translator: "陶泽慧", year: 2018, doubanUrl: "https://book.douban.com/subject/30225784/" }
    ],
    imageSource: "",
    rightsStatus: "placeholder",
    licenseNote: ""
  },
  {
    id: "book-006",
    title: "记忆传授人",
    originalTitle: "The Giver",
    author: "露易丝·劳瑞",
    cover: "",
    doubanUrl: "https://book.douban.com/subject/26267048/",
    chineseEdition: { hasSimplifiedChinese: true, publisher: "河北教育出版社", translator: "", editionNote: "简体版亦译作《记忆传授人》", sourceUrl: "" },
    episodeIds: ["episode-009"],
    tags: ["科幻", "反乌托邦"],
    summary: "露易丝·劳瑞的反乌托邦小说，少年乔纳斯在看似完美的社区里发现被抹去的记忆。",
    verificationStatus: "confirmed",
    sources: [
      { label: "粉丝整理 LLTP 期数表", url: "" },
      { label: "豆瓣条目页", url: "https://book.douban.com/subject/26267048/" }
    ],
    xiaohongshuUrl: "",
    xiaohongshuNoteTitle: "",
    lastVerified: "2026-10-15",
    lastUpdated: "",
    note: "",
    adaptations: [],
    editions: [],
    imageSource: "",
    rightsStatus: "placeholder",
    licenseNote: ""
  },
  {
    id: "book-007",
    title: "周四推理俱乐部：活了两次的男人",
    originalTitle: "The Man Who Died Twice",
    author: "理查德·奥斯曼",
    cover: "",
    doubanUrl: "https://book.douban.com/subject/36177409/",
    chineseEdition: { hasSimplifiedChinese: true, publisher: "接力出版社", translator: "", editionNote: "简体中文版名为《周四推理俱乐部：活了两次的男人》", sourceUrl: "" },
    episodeIds: ["episode-011"],
    tags: ["推理", "系列"],
    summary: "《星期四谋杀俱乐部》系列第二部，老侦探们再次卷入谋杀与旧案。",
    verificationStatus: "confirmed",
    sources: [
      { label: "粉丝整理 LLTP 期数表", url: "" },
      { label: "豆瓣条目页", url: "https://book.douban.com/subject/36177409/" }
    ],
    xiaohongshuUrl: "",
    xiaohongshuNoteTitle: "",
    lastVerified: "2026-10-15",
    lastUpdated: "",
    note: "系列第二部，另译《活了两次的男人》；第 11 期讲的是第二本。",
    adaptations: [],
    editions: [],
    imageSource: "",
    rightsStatus: "placeholder",
    licenseNote: ""
  },
  {
    id: "book-009",
    title: "火星救援",
    originalTitle: "The Martian",
    author: "安迪·威尔",
    cover: "",
    doubanUrl: "https://book.douban.com/subject/26586492/",
    chineseEdition: { hasSimplifiedChinese: true, publisher: "译林出版社", translator: "陈灼", editionNote: "译林出版社 2015 年简体版", sourceUrl: "" },
    episodeIds: ["episode-014"],
    tags: ["科幻", "硬科幻", "生存"],
    summary: "安迪·威尔的科幻小说，宇航员马克·沃特尼被遗留在火星，靠科学知识自救求生。",
    verificationStatus: "confirmed",
    sources: [
      { label: "粉丝整理 LLTP 期数表", url: "" },
      { label: "本站《火星救援》小红书解读整理稿", url: "" },
      { label: "豆瓣条目页", url: "https://book.douban.com/subject/26586492/" }
    ],
    xiaohongshuUrl: "https://www.xiaohongshu.com/explore/6ad24a09000000000a02477b",
    xiaohongshuNoteTitle: "是什么让深爱土豆之人如此伤心？",
    lastVerified: "2026-10-15",
    lastUpdated: "",
    note: "",
    adaptations: [
      { title: "火星救援", year: 2015, form: "电影", doubanUrl: "https://movie.douban.com/subject/25864085/" }
    ],
    editions: [],
    imageSource: "",
    rightsStatus: "placeholder",
    licenseNote: ""
  },
  {
    id: "book-011",
    title: "傲慢与偏见",
    originalTitle: "Pride and Prejudice",
    author: "简·奥斯汀",
    cover: "",
    doubanUrl: "https://book.douban.com/subject/4881639/",
    chineseEdition: { hasSimplifiedChinese: true, publisher: "译林出版社", translator: "孙致礼", editionNote: "译林出版社 2010 年孙致礼译本（微信读书同译本）", sourceUrl: "" },
    episodeIds: ["episode-017"],
    tags: ["经典", "爱情", "名著"],
    summary: "简·奥斯汀的经典小说，伊丽莎白与达西在误解与偏见中走向彼此。",
    verificationStatus: "confirmed",
    sources: [
      { label: "粉丝整理 LLTP 期数表", url: "" },
      { label: "本站《傲慢与偏见》小红书解读整理稿", url: "" },
      { label: "豆瓣条目页", url: "https://book.douban.com/subject/4881639/" }
    ],
    xiaohongshuUrl: "https://www.xiaohongshu.com/explore/6ac73c0c0000000018011f4e",
    xiaohongshuNoteTitle: "不完美，才是真实的人",
    lastVerified: "2026-10-15",
    lastUpdated: "",
    note: "",
    adaptations: [
      { title: "傲慢与偏见", year: 2005, form: "电影", doubanUrl: "https://movie.douban.com/subject/1418200/" },
      { title: "傲慢与偏见", year: 1995, form: "剧集", doubanUrl: "https://movie.douban.com/subject/1301174/" },
      { title: "傲慢与偏见", year: 1940, form: "电影", doubanUrl: "https://movie.douban.com/subject/1302868/" }
    ],
    editions: [
      { publisher: "译林出版社", translator: "孙致礼", year: 2010, doubanUrl: "https://book.douban.com/subject/4881639/" },
      { publisher: "上海译文出版社", translator: "王科一", year: 2006, doubanUrl: "https://book.douban.com/subject/1885224/" },
      { publisher: "人民文学出版社", translator: "张玲、张扬", year: 1993, doubanUrl: "https://book.douban.com/subject/1083428/" }
    ],
    imageSource: "https://commons.wikimedia.org/wiki/File:PrideAndPrejudiceTitlePage.jpg",
    rightsStatus: "placeholder",
    licenseNote: "候选：1813 年首版书名页扫描（另有 1833 年 Bentley 版内页插图）。来源标注 Public Domain —— 原著 1813 年出版，在美国已进入公有领域。尚未逐字核验文件页授权标签，故未启用。"
  },
  {
    id: "book-012",
    title: "了不起的盖茨比",
    originalTitle: "The Great Gatsby",
    author: "F. S. 菲茨杰拉德",
    cover: "",
    doubanUrl: "https://book.douban.com/subject/1008988/",
    chineseEdition: { hasSimplifiedChinese: true, publisher: "人民文学出版社", translator: "姚乃强", editionNote: "人民文学出版社 2004 年姚乃强译本（豆瓣评价最多）", sourceUrl: "" },
    episodeIds: ["episode-019", "episode-guanshu"],
    tags: ["经典", "名著"],
    summary: "菲茨杰拉德的小说，讲述 1920 年代纽约长岛，盖茨比对旧爱黛西的执念。",
    verificationStatus: "confirmed",
    sources: [
      { label: "粉丝整理 LLTP 期数表", url: "" },
      { label: "LLTP 番外·逛书架 整理图", url: "" },
      { label: "豆瓣条目页", url: "https://book.douban.com/subject/1008988/" }
    ],
    xiaohongshuUrl: "https://www.xiaohongshu.com/explore/6ac1d9ca000000000b005045",
    xiaohongshuNoteTitle: "LLTP番外：KPOP传奇爱书人Lily的书单大放送",
    lastVerified: "2026-10-15",
    lastUpdated: "",
    note: "",
    adaptations: [
      { title: "了不起的盖茨比", year: 2013, form: "电影", doubanUrl: "https://movie.douban.com/subject/3364223/" },
      { title: "了不起的盖茨比", year: 1974, form: "电影", doubanUrl: "https://movie.douban.com/subject/1297239/" },
      { title: "了不起的盖茨比", year: 2000, form: "电影", doubanUrl: "https://movie.douban.com/subject/1936887/" }
    ],
    editions: [
      { publisher: "上海译文出版社", translator: "巫宁坤", year: 2009, doubanUrl: "https://book.douban.com/subject/4149805/" },
      { publisher: "人民文学出版社", translator: "姚乃强", year: 2004, doubanUrl: "https://book.douban.com/subject/1008988/" },
      { publisher: "南海出版公司", translator: "邓若虚", year: 2012, doubanUrl: "https://book.douban.com/subject/10738023/" }
    ],
    imageSource: "",
    rightsStatus: "placeholder",
    licenseNote: ""
  },
  {
    id: "book-014",
    title: "尼罗河上的惨案",
    originalTitle: "Death on the Nile",
    author: "阿加莎·克里斯蒂",
    cover: "",
    doubanUrl: "https://book.douban.com/subject/1329959/",
    chineseEdition: { hasSimplifiedChinese: true, publisher: "贵州人民出版社", translator: "", editionNote: "1998 年全译本（豆瓣评价最多）", sourceUrl: "" },
    episodeIds: ["episode-021"],
    tags: ["推理", "名著"],
    summary: "阿加莎·克里斯蒂的推理小说，侦探波洛在尼罗河游轮上调查命案。",
    verificationStatus: "confirmed",
    sources: [
      { label: "粉丝整理 LLTP 期数表", url: "" },
      { label: "豆瓣条目页", url: "https://book.douban.com/subject/1329959/" }
    ],
    xiaohongshuUrl: "",
    xiaohongshuNoteTitle: "",
    lastVerified: "2026-10-15",
    lastUpdated: "",
    note: "",
    adaptations: [
      { title: "尼罗河上的惨案", year: 2022, form: "电影", doubanUrl: "https://movie.douban.com/subject/27203644/" },
      { title: "尼罗河上的惨案", year: 1978, form: "电影", doubanUrl: "https://movie.douban.com/subject/1302100/" }
    ],
    editions: [
      { publisher: "人民文学出版社", translator: "宫英海", year: 2006, doubanUrl: "https://book.douban.com/subject/1818347/" },
      { publisher: "新星出版社", translator: "张乐敏", year: 2013, doubanUrl: "https://book.douban.com/subject/25697546/" }
    ],
    imageSource: "",
    rightsStatus: "placeholder",
    licenseNote: ""
  },
  {
    id: "book-016",
    title: "呼啸山庄",
    originalTitle: "Wuthering Heights",
    author: "艾米莉·勃朗特",
    cover: "",
    doubanUrl: "https://book.douban.com/subject/4898521/",
    chineseEdition: { hasSimplifiedChinese: true, publisher: "译林出版社", translator: "杨苡", editionNote: "译林出版社 2010 年杨苡译本（豆瓣评价最多）", sourceUrl: "" },
    episodeIds: ["episode-023"],
    tags: ["经典", "名著", "爱情"],
    summary: "艾米莉·勃朗特的经典小说，讲述希斯克利夫与凯瑟琳之间的爱恨。",
    verificationStatus: "confirmed",
    sources: [
      { label: "粉丝整理 LLTP 期数表", url: "" },
      { label: "豆瓣条目页", url: "https://book.douban.com/subject/4898521/" }
    ],
    xiaohongshuUrl: "",
    xiaohongshuNoteTitle: "",
    lastVerified: "2026-10-15",
    lastUpdated: "",
    note: "",
    adaptations: [
      { title: "呼啸山庄", year: 2009, form: "剧集", doubanUrl: "https://movie.douban.com/subject/3226150/" },
      { title: "呼啸山庄", year: 1992, form: "电影", doubanUrl: "https://movie.douban.com/subject/1301676/" }
    ],
    editions: [
      { publisher: "译林出版社", translator: "杨苡", year: 2010, doubanUrl: "https://book.douban.com/subject/4898521/" },
      { publisher: "上海译文出版社", translator: "方平", year: 2006, doubanUrl: "https://book.douban.com/subject/1880829/" },
      { publisher: "上海文艺出版社", translator: "宋兆霖", year: 2007, doubanUrl: "https://book.douban.com/subject/2253389/" }
    ],
    imageSource: "",
    rightsStatus: "placeholder",
    licenseNote: ""
  },
  {
    id: "book-017",
    title: "银河系漫游指南",
    originalTitle: "The Hitchhiker's Guide to the Galaxy",
    author: "道格拉斯·亚当斯",
    cover: "",
    doubanUrl: "https://book.douban.com/subject/1394364/",
    chineseEdition: { hasSimplifiedChinese: true, publisher: "四川科学技术出版社", translator: "徐百柯", editionNote: "2005 年简体版（豆瓣评价最多）", sourceUrl: "" },
    episodeIds: ["episode-024"],
    tags: ["科幻", "喜剧"],
    summary: "道格拉斯·亚当斯的科幻喜剧，地球被拆除后，主人公开始一场荒诞的银河冒险。",
    verificationStatus: "confirmed",
    sources: [
      { label: "粉丝整理 LLTP 期数表", url: "" },
      { label: "豆瓣条目页", url: "https://book.douban.com/subject/1394364/" }
    ],
    xiaohongshuUrl: "",
    xiaohongshuNoteTitle: "",
    lastVerified: "2026-10-15",
    lastUpdated: "",
    note: "",
    adaptations: [
      { title: "银河系漫游指南", year: 2005, form: "电影", doubanUrl: "https://movie.douban.com/subject/1292267/" },
      { title: "银河系漫游指南", year: 1981, form: "剧集", doubanUrl: "https://movie.douban.com/subject/1756809/" }
    ],
    editions: [
      { publisher: "四川科学技术出版社", translator: "徐百柯", year: 2005, doubanUrl: "https://book.douban.com/subject/1394364/" },
      { publisher: "上海译文出版社", translator: "姚向辉", year: 2011, doubanUrl: "https://book.douban.com/subject/6265745/" }
    ],
    imageSource: "",
    rightsStatus: "placeholder",
    licenseNote: ""
  },
  {
    id: "book-019",
    title: "爱玛",
    originalTitle: "Emma",
    author: "简·奥斯汀",
    cover: "",
    doubanUrl: "https://book.douban.com/subject/1093098/",
    chineseEdition: { hasSimplifiedChinese: true, publisher: "译林出版社", translator: "孙致礼", editionNote: "简体中文版名为《爱玛》（译林出版社）", sourceUrl: "" },
    episodeIds: ["episode-026"],
    tags: ["经典", "名著"],
    summary: "简·奥斯汀的小说，讲述爱撮合别人婚事的艾玛自己的成长。",
    verificationStatus: "confirmed",
    sources: [
      { label: "粉丝整理 LLTP 期数表", url: "" },
      { label: "豆瓣条目页", url: "https://book.douban.com/subject/1093098/" }
    ],
    xiaohongshuUrl: "",
    xiaohongshuNoteTitle: "",
    lastVerified: "2026-10-15",
    lastUpdated: "",
    note: "另译《艾玛》。",
    adaptations: [
      { title: "爱玛", year: 2020, form: "电影", doubanUrl: "https://movie.douban.com/subject/30361878/" },
      { title: "艾玛", year: 2009, form: "剧集", doubanUrl: "https://movie.douban.com/subject/3610967/" },
      { title: "艾玛", year: 1996, form: "电影", doubanUrl: "https://movie.douban.com/subject/1297540/" }
    ],
    editions: [
      { publisher: "译林出版社", translator: "孙致礼", year: 2001, doubanUrl: "https://book.douban.com/subject/1093098/" },
      { publisher: "人民文学出版社", translator: "李文俊、蔡慧", year: 2005, doubanUrl: "https://book.douban.com/subject/1426166/" },
      { publisher: "上海译文出版社", translator: "祝庆英、祝文光", year: 2021, doubanUrl: "https://book.douban.com/subject/35618268/" }
    ],
    imageSource: "https://commons.wikimedia.org/wiki/File:EmmaTitlePage.jpg",
    rightsStatus: "placeholder",
    licenseNote: "候选：1815/1816 年首版书名页扫描。来源标注 Public Domain —— 原著 1815 年出版，在美国已进入公有领域。尚未逐字核验文件页授权标签，故未启用。"
  },
  {
    id: "book-021",
    title: "血字的研究",
    originalTitle: "A Study in Scarlet",
    author: "阿瑟·柯南·道尔",
    cover: "",
    doubanUrl: "https://book.douban.com/subject/6127036/",
    chineseEdition: { hasSimplifiedChinese: true, publisher: "新星出版社", translator: "", editionNote: "2011 年简体版（豆瓣评价最多）", sourceUrl: "" },
    episodeIds: ["episode-028"],
    tags: ["推理", "名著", "系列"],
    summary: "柯南·道尔的第一部福尔摩斯小说，福尔摩斯与华生首次相遇并侦破命案。",
    verificationStatus: "confirmed",
    sources: [
      { label: "粉丝整理 LLTP 期数表", url: "" },
      { label: "豆瓣条目页", url: "https://book.douban.com/subject/6127036/" }
    ],
    xiaohongshuUrl: "",
    xiaohongshuNoteTitle: "",
    lastVerified: "2026-10-15",
    lastUpdated: "",
    note: "",
    adaptations: [
      { title: "血字的研究", year: 1968, form: "电影", doubanUrl: "https://movie.douban.com/subject/4309367/" },
      { title: "血字的研究", year: 1933, form: "电影", doubanUrl: "https://movie.douban.com/subject/2211885/" }
    ],
    editions: [
      { publisher: "天津人民出版社", translator: "张雅琳", year: 2019, doubanUrl: "https://book.douban.com/subject/34805607/" },
      { publisher: "新星出版社", translator: "兴仲华", year: 2011, doubanUrl: "https://book.douban.com/subject/6127036/" },
      { publisher: "上海社会科学院出版社", translator: "俞步凡", year: 2012, doubanUrl: "https://book.douban.com/subject/6308163/" }
    ],
    imageSource: "https://commons.wikimedia.org/wiki/File:Beeton's_Christmas_Annual_1887.jpg",
    rightsStatus: "placeholder",
    licenseNote: "候选：1887 年《Beeton's Christmas Annual》首刊封面（David Henry Friston 绘）。来源标注 Public Domain —— 1887 年出版，在美国已进入公有领域。尚未逐字核验文件页授权标签，故未启用。"
  },
  {
    id: "book-029",
    title: "密林勿近",
    originalTitle: "Don't Let the Forest In",
    author: "C. G. 德鲁丝",
    cover: "",
    doubanUrl: "https://book.douban.com/subject/37478500/",
    chineseEdition: { hasSimplifiedChinese: null, publisher: "寂寞出版（繁体）", translator: "謝佳真（繁体）", editionNote: "目前仅见英文原版（2024-10）与繁体版（寂寞出版，謝佳真 译，2025-10）；简体版待确认", sourceUrl: "" },
    episodeIds: ["episode-guanshu"],
    tags: ["小说", "哥特"],
    summary: "C. G. 德鲁丝的哥特小说：写作者笔下的怪物成真，开始袭击身边的人。",
    verificationStatus: "confirmed",
    sources: [
      { label: "LLTP 番外·逛书架 整理图", url: "" },
      { label: "豆瓣条目页", url: "https://book.douban.com/subject/37478500/" }
    ],
    xiaohongshuUrl: "https://www.xiaohongshu.com/explore/6ac1d9ca000000000b005045",
    xiaohongshuNoteTitle: "LLTP番外：KPOP传奇爱书人Lily的书单大放送",
    lastVerified: "2026-10-16",
    lastUpdated: "",
    note: "",
    adaptations: [],
    editions: [],
    imageSource: "",
    rightsStatus: "placeholder",
    licenseNote: ""
  },
  {
    id: "book-030",
    title: "蝴蝶梦",
    originalTitle: "Rebecca",
    author: "达夫妮·杜穆里埃",
    cover: "",
    doubanUrl: "https://book.douban.com/subject/1085021/",
    chineseEdition: { hasSimplifiedChinese: true, publisher: "上海译文出版社", translator: "林智玲、程德", editionNote: "上海译文 1994 年初版、2006 年再版（林智玲、程德 译）", sourceUrl: "" },
    episodeIds: ["episode-guanshu"],
    tags: ["悬疑", "名著"],
    summary: "达夫妮·杜穆里埃的小说，讲述女主角嫁入曼陀丽庄园后，被前妻丽贝卡的阴影笼罩。",
    verificationStatus: "confirmed",
    sources: [
      { label: "LLTP 番外·逛书架 整理图", url: "" },
      { label: "豆瓣条目页", url: "https://book.douban.com/subject/1085021/" }
    ],
    xiaohongshuUrl: "https://www.xiaohongshu.com/explore/6ac1d9ca000000000b005045",
    xiaohongshuNoteTitle: "LLTP番外：KPOP传奇爱书人Lily的书单大放送",
    lastVerified: "2026-10-16",
    lastUpdated: "",
    note: "",
    adaptations: [
      { title: "蝴蝶梦", year: 2020, form: "电影", doubanUrl: "https://movie.douban.com/subject/10490568/" },
      { title: "蝴蝶梦", year: 1997, form: "剧集", doubanUrl: "https://movie.douban.com/subject/1947699/" },
      { title: "蝴蝶梦", year: 1940, form: "电影", doubanUrl: "https://movie.douban.com/subject/1293824/" }
    ],
    editions: [
      { publisher: "译林出版社", translator: "林智玲、程德", year: 2010, doubanUrl: "https://book.douban.com/subject/5285281/" },
      { publisher: "花山文艺出版社", translator: "方华文", year: 2016, doubanUrl: "https://book.douban.com/subject/26591905/" }
    ],
    imageSource: "",
    rightsStatus: "placeholder",
    licenseNote: ""
  },
  {
    id: "book-031",
    title: "波西·杰克逊系列",
    originalTitle: "Percy Jackson",
    author: "雷克·莱尔顿",
    cover: "",
    doubanUrl: "https://book.douban.com/subject/4604958/",
    chineseEdition: { hasSimplifiedChinese: true, publisher: "接力出版社", translator: "薛白", editionNote: "系列第一册《波西·杰克逊与神火之盗》，接力出版社 2010 年 3 月版，薛白 译", sourceUrl: "" },
    episodeIds: ["episode-guanshu"],
    tags: ["奇幻", "系列", "成长"],
    summary: "雷克·莱尔顿的奇幻系列，讲述少年波西发现自己身份是希腊神话中的半神。",
    verificationStatus: "confirmed",
    sources: [
      { label: "LLTP 番外·逛书架 整理图", url: "" },
      { label: "豆瓣条目页", url: "https://book.douban.com/subject/4604958/" }
    ],
    xiaohongshuUrl: "https://www.xiaohongshu.com/explore/6ac1d9ca000000000b005045",
    xiaohongshuNoteTitle: "LLTP番外：KPOP传奇爱书人Lily的书单大放送",
    lastVerified: "2026-10-16",
    lastUpdated: "",
    note: "",
    adaptations: [
      { title: "波西·杰克逊 第一季", year: 2023, form: "剧集", doubanUrl: "https://movie.douban.com/subject/35073141/" },
      { title: "波西·杰克逊与魔兽之海", year: 2013, form: "电影", doubanUrl: "https://movie.douban.com/subject/10439805/" },
      { title: "波西·杰克逊与神火之盗", year: 2010, form: "电影", doubanUrl: "https://movie.douban.com/subject/3090455/" }
    ],
    editions: [],
    imageSource: "",
    rightsStatus: "placeholder",
    licenseNote: ""
  },
  {
    id: "book-032",
    title: "黛西与乐队",
    originalTitle: "Daisy Jones & The Six",
    author: "泰勒·詹金斯·里德",
    cover: "",
    doubanUrl: "https://book.douban.com/subject/30355040/",
    chineseEdition: { hasSimplifiedChinese: null, publisher: "臉譜（繁体台版）", translator: "徐彩嫦（繁体）", editionNote: "目前仅见英文原版与繁体台版（臉譜，徐彩嫦 译，2024-03）；简体版待确认", sourceUrl: "" },
    episodeIds: ["episode-guanshu"],
    tags: ["音乐", "小说"],
    summary: "泰勒·詹金斯·里德的小说，以访谈形式讲述一支虚构摇滚乐队的兴衰。",
    verificationStatus: "confirmed",
    sources: [
      { label: "LLTP 番外·逛书架 整理图", url: "" },
      { label: "豆瓣条目页", url: "https://book.douban.com/subject/30355040/" }
    ],
    xiaohongshuUrl: "https://www.xiaohongshu.com/explore/6ac1d9ca000000000b005045",
    xiaohongshuNoteTitle: "LLTP番外：KPOP传奇爱书人Lily的书单大放送",
    lastVerified: "2026-10-16",
    lastUpdated: "",
    note: "",
    adaptations: [
      { title: "黛西与乐队", year: 2023, form: "剧集", doubanUrl: "https://movie.douban.com/subject/30284142/" }
    ],
    editions: [],
    imageSource: "",
    rightsStatus: "placeholder",
    licenseNote: ""
  },
  {
    id: "book-033",
    title: "我存在",
    originalTitle: "I Am, I Am, I Am",
    author: "玛姬·欧法洛",
    cover: "",
    doubanUrl: "https://book.douban.com/subject/35752111/",
    chineseEdition: { hasSimplifiedChinese: true, publisher: "武汉大学出版社", translator: "刘雅娟", editionNote: "2022 年 2 月版，副标题「十七段与死亡擦肩而过的经历」", sourceUrl: "" },
    episodeIds: ["episode-guanshu"],
    tags: ["回忆录"],
    summary: "玛姬·欧法洛的回忆录，以十七段与死亡擦肩而过的经历回望人生。",
    verificationStatus: "confirmed",
    sources: [
      { label: "LLTP 番外·逛书架 整理图", url: "" },
      { label: "豆瓣条目页", url: "https://book.douban.com/subject/35752111/" }
    ],
    xiaohongshuUrl: "https://www.xiaohongshu.com/explore/6ac1d9ca000000000b005045",
    xiaohongshuNoteTitle: "LLTP番外：KPOP传奇爱书人Lily的书单大放送",
    lastVerified: "2026-10-16",
    lastUpdated: "",
    note: "",
    adaptations: [],
    editions: [],
    imageSource: "",
    rightsStatus: "placeholder",
    licenseNote: ""
  },
  {
    id: "book-034",
    title: "我妈走后，我终于成了一个正常人",
    originalTitle: "I'm Glad My Mom Died",
    author: "珍妮特·麦柯迪",
    cover: "",
    doubanUrl: "https://book.douban.com/subject/36744525/",
    chineseEdition: { hasSimplifiedChinese: true, publisher: "中国友谊出版公司", translator: "薛玮", editionNote: "2024 年 9 月版，薛玮 译", sourceUrl: "" },
    episodeIds: ["episode-guanshu"],
    tags: ["回忆录", "成长"],
    summary: "珍妮特·麦柯迪的回忆录，讲述她作为童星的成长经历与家庭关系。",
    verificationStatus: "confirmed",
    sources: [
      { label: "LLTP 番外·逛书架 整理图", url: "" },
      { label: "豆瓣条目页", url: "https://book.douban.com/subject/36744525/" }
    ],
    xiaohongshuUrl: "https://www.xiaohongshu.com/explore/6ac1d9ca000000000b005045",
    xiaohongshuNoteTitle: "LLTP番外：KPOP传奇爱书人Lily的书单大放送",
    lastVerified: "2026-10-16",
    lastUpdated: "",
    note: "另译《我很高兴我妈死了》。",
    adaptations: [],
    editions: [],
    imageSource: "",
    rightsStatus: "placeholder",
    licenseNote: ""
  },
  {
    id: "book-037",
    title: "弗兰肯斯坦",
    originalTitle: "Frankenstein",
    author: "玛丽·雪莱",
    cover: "",
    doubanUrl: "https://book.douban.com/subject/26921825/",
    chineseEdition: { hasSimplifiedChinese: true, publisher: "译林出版社", translator: "孙法理", editionNote: "译林出版社 2016 年 12 月版，孙法理 译", sourceUrl: "" },
    episodeIds: ["episode-frankenstein"],
    tags: ["科幻", "名著", "预告"],
    summary: "玛丽·雪莱的科幻小说（1818），讲述科学家维克多创造生命后的悲剧。",
    verificationStatus: "confirmed",
    sources: [
      { label: "LLTP 预告·弗兰肯斯坦 整理图", url: "" },
      { label: "豆瓣条目页", url: "https://book.douban.com/subject/26921825/" }
    ],
    xiaohongshuUrl: "https://www.xiaohongshu.com/explore/6ac36c2a000000000a025848",
    xiaohongshuNoteTitle: "LLTP#29预告 《弗兰肯斯坦》",
    lastVerified: "2026-10-16",
    lastUpdated: "",
    note: "",
    adaptations: [
      { title: "弗兰肯斯坦", year: 2025, form: "电影", doubanUrl: "https://movie.douban.com/subject/3262044/" },
      { title: "科学怪人", year: 1994, form: "电影", doubanUrl: "https://movie.douban.com/subject/1293778/" },
      { title: "科学怪人", year: 1931, form: "电影", doubanUrl: "https://movie.douban.com/subject/1296929/" }
    ],
    editions: [
      { publisher: "译林出版社", translator: "孙法理", year: 2016, doubanUrl: "https://book.douban.com/subject/26921825/" },
      { publisher: "上海译文出版社", translator: "刘新民", year: 2020, doubanUrl: "https://book.douban.com/subject/35178089/" },
      { publisher: "上海文艺出版社", translator: "周沛郁", year: 2019, doubanUrl: "https://book.douban.com/subject/30466750/" }
    ],
    imageSource: "https://commons.wikimedia.org/wiki/File:Frankenstein_1818_edition_title_page.jpg",
    rightsStatus: "placeholder",
    licenseNote: "候选：1818 年首版书名页扫描。来源标注 Public Domain —— 原著 1818 年出版，在美国已进入公有领域。尚未逐字核验文件页授权标签，故未启用。"
  }
];
