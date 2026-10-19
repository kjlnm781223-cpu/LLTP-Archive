/**
 * LLTP Archive · 节目期数数据
 * ------------------------------------------------------------
 * 本文件是网站的唯一节目数据来源，请在 README.md 的方法指引下维护。
 *
 * 数据说明：
 * - 期数 / 片名 / 书名 / 类型，来自粉丝整理的 LLTP 期数表 + 小百合研究所
 *   「文学委员小莉的推书/电影合集」（2026-10 核对）。
 * - 全部 28 期的作品名已确认，不再有「片名待核实」占位。
 * - releaseDate 与 officialUrl 仍留空：前者没有权威来源，后者只见到粉丝中字搬运，
 *   一律不写入（宁缺勿编）。
 * - note 用于记录「同一作品的不同译名」等核对备注，避免读者对不上号。
 *
 * kind 取值："book"（读书期）| "movie"（观影期）| "extra"（番外 / 预告）
 *
 * 双向关联：bookIds ↔ books.js 的 episodeIds；movieIds ↔ movies.js 的 episodeIds。
 * 一期可以同时关联多本书和多部电影；一本书 / 一部电影也可以出现在多期。
 */
window.EPISODES = [
  {
    id: "episode-001",
    episodeNumber: 1,
    title: "哈利·波特系列",
    englishTitle: "Harry Potter series",
    kind: "book",
    releaseDate: "",
    summary: "共读 J.K. 罗琳的哈利·波特系列——一个在碗柜里长大的男孩，收到猫头鹰送来的信，走进霍格沃茨，才知道自己是巫师。",
    note: "本期聊的是整个系列，书目收录第一册《哈利·波特与魔法石》。",
    officialUrl: "",
    xiaohongshuUrl: "",
    xiaohongshuNoteTitle: "",
    bookIds: ["book-001"],
    movieIds: [],
    verificationStatus: "confirmed",
    lastVerified: "2026-10-15",
    lastUpdated: "",
    replays: [
      { url: "https://www.bilibili.com/video/BV1rd4y1H79x/", by: "两站联合中字" }
    ]
  },
  {
    id: "episode-002",
    episodeNumber: 2,
    title: "爱乐之城",
    englishTitle: "La La Land",
    kind: "movie",
    releaseDate: "",
    summary: "本期讨论电影《爱乐之城》——两个追梦的人彼此遇见，洛杉矶的夜晚，梦想和爱情只能选一个。",
    note: "",
    officialUrl: "",
    xiaohongshuUrl: "",
    xiaohongshuNoteTitle: "",
    bookIds: [],
    movieIds: ["movie-009"],
    verificationStatus: "confirmed",
    lastVerified: "2026-10-15",
    lastUpdated: "",
    replays: [
      { url: "https://www.bilibili.com/video/BV1f24y1G7Kh/", by: "两站联合中字" }
    ]
  },
  {
    id: "episode-003",
    episodeNumber: 3,
    title: "再次出发之纽约遇见你",
    englishTitle: "Begin Again",
    kind: "movie",
    releaseDate: "",
    summary: "本期讨论电影《再次出发之纽约遇见你》——两个在纽约失意的人，决定在城市的每个角落录一张专辑。",
    note: "",
    officialUrl: "",
    xiaohongshuUrl: "",
    xiaohongshuNoteTitle: "",
    bookIds: [],
    movieIds: ["movie-008"],
    verificationStatus: "confirmed",
    lastVerified: "2026-10-15",
    lastUpdated: "",
    replays: [
      { url: "https://www.bilibili.com/video/BV12V4y1Q7gu/", by: "莉屋中字" }
    ]
  },
  {
    id: "episode-004",
    episodeNumber: 4,
    title: "周四推理俱乐部",
    englishTitle: "The Thursday Murder Club",
    kind: "book",
    releaseDate: "",
    summary: "共读理查德·奥斯曼《周四推理俱乐部》——四个养老社区的老人家，把每周四的茶话会变成了破案会。本以为是打发时间的游戏，直到小区里真的挖出一桩陈年命案。",
    note: "",
    officialUrl: "",
    xiaohongshuUrl: "",
    xiaohongshuNoteTitle: "",
    bookIds: ["book-002"],
    movieIds: [],
    verificationStatus: "confirmed",
    lastVerified: "2026-10-15",
    lastUpdated: "",
    replays: [
      { url: "https://www.bilibili.com/video/BV1vh4y1J7V8/", by: "莉屋中字" }
    ]
  },
  {
    id: "episode-005",
    episodeNumber: 5,
    title: "本杰明·巴顿奇事",
    englishTitle: "The Curious Case of Benjamin Button",
    kind: "movie",
    releaseDate: "",
    summary: "本期讨论电影《本杰明·巴顿奇事》——一出生就是八十岁的模样，往后越活越年轻，爱情在倒流的时光里错身而过。",
    note: "本片也译作《返老还童》。",
    officialUrl: "",
    xiaohongshuUrl: "",
    xiaohongshuNoteTitle: "",
    bookIds: [],
    movieIds: ["movie-001"],
    verificationStatus: "confirmed",
    lastVerified: "2026-10-15",
    lastUpdated: "",
    replays: [
      { url: "https://www.bilibili.com/video/BV1au411L7WZ/", by: "莉屋中字" }
    ]
  },
  {
    id: "episode-006",
    episodeNumber: 6,
    title: "当怪物来敲门",
    englishTitle: "A Monster Calls",
    kind: "book",
    releaseDate: "",
    summary: "共读派崔克·奈斯《当怪物来敲门》——康纳十二岁，母亲病重。每天凌晨 12:07，窗外那棵老树变成怪物来找他，讲三个故事——它真正想要的第四个故事，是康纳自己都不敢听的真相。",
    note: "",
    officialUrl: "",
    xiaohongshuUrl: "",
    xiaohongshuNoteTitle: "",
    bookIds: ["book-004"],
    movieIds: [],
    verificationStatus: "confirmed",
    lastVerified: "2026-10-15",
    lastUpdated: "",
    replays: [
      { url: "https://www.bilibili.com/video/BV19u4y1v7YL/", by: "莉屋中字" }
    ]
  },
  {
    id: "episode-007",
    episodeNumber: 7,
    title: "马戏之王",
    englishTitle: "The Greatest Showman",
    kind: "movie",
    releaseDate: "",
    summary: "本期讨论电影《马戏之王》——一个想当明星的穷小子，把最猎奇的表演搬上舞台，造出了全世界最热闹的马戏团。",
    note: "",
    officialUrl: "",
    xiaohongshuUrl: "",
    xiaohongshuNoteTitle: "",
    bookIds: [],
    movieIds: ["movie-010"],
    verificationStatus: "confirmed",
    lastVerified: "2026-10-15",
    lastUpdated: "",
    replays: [
      { url: "https://www.bilibili.com/video/BV1vz4y157oj/", by: "莉屋中字" }
    ]
  },
  {
    id: "episode-008",
    episodeNumber: 8,
    title: "偷书贼",
    englishTitle: "The Book Thief",
    kind: "book",
    releaseDate: "",
    summary: "共读马克斯·苏萨克《偷书贼》——二战德国，女孩莉赛尔靠偷书与文字活过战争，而讲这个故事的，是死神。",
    note: "",
    officialUrl: "",
    xiaohongshuUrl: "",
    xiaohongshuNoteTitle: "",
    bookIds: ["book-005"],
    movieIds: [],
    verificationStatus: "confirmed",
    lastVerified: "2026-10-15",
    lastUpdated: "",
    replays: []
  },
  {
    id: "episode-009",
    episodeNumber: 9,
    title: "记忆传授人",
    englishTitle: "The Giver",
    kind: "book",
    releaseDate: "",
    summary: "共读露易丝·劳瑞《记忆传授人》——一个没有痛苦也没有选择的完美社区，少年乔纳斯被选为记忆传承人，才看见被抹掉的颜色和爱。",
    note: "",
    officialUrl: "",
    xiaohongshuUrl: "",
    xiaohongshuNoteTitle: "",
    bookIds: ["book-006"],
    movieIds: [],
    verificationStatus: "confirmed",
    lastVerified: "2026-10-15",
    lastUpdated: "",
    replays: []
  },
  {
    id: "episode-010",
    episodeNumber: 10,
    title: "梦女孩",
    englishTitle: "Dreamgirls",
    kind: "movie",
    releaseDate: "",
    summary: "本期讨论电影《梦女孩》——三个女孩组成的组合一夜成名，聚光灯下越唱越远，成名把她们彼此推得越来越开。",
    note: "豆瓣条目为《梦女孩》，又名《追梦女郎》。",
    officialUrl: "",
    xiaohongshuUrl: "",
    xiaohongshuNoteTitle: "",
    bookIds: [],
    movieIds: ["movie-011"],
    verificationStatus: "confirmed",
    lastVerified: "2026-10-15",
    lastUpdated: "",
    replays: []
  },
  {
    id: "episode-011",
    episodeNumber: 11,
    title: "活了两次的男人",
    englishTitle: "The Man Who Died Twice",
    kind: "book",
    releaseDate: "",
    summary: "共读理查德·奥斯曼《活了两次的男人》，即《周四推理俱乐部》系列第二部——一个人死过一次不算完，又死了第二次，四位老伙计被拖进一桩纠缠着旧案的谋杀。",
    note: "简体中文版书名为《周四推理俱乐部：活了两次的男人》。",
    officialUrl: "",
    xiaohongshuUrl: "",
    xiaohongshuNoteTitle: "",
    bookIds: ["book-007"],
    movieIds: [],
    verificationStatus: "confirmed",
    lastVerified: "2026-10-15",
    lastUpdated: "",
    replays: []
  },
  {
    id: "episode-012",
    episodeNumber: 12,
    title: "小鬼当家",
    englishTitle: "Home Alone",
    kind: "movie",
    releaseDate: "",
    summary: "本期讨论电影《小鬼当家》——全家飞去度假，把八岁的凯文落在了家里。两个笨贼摸上门，才知道这栋房子里住着最难对付的小孩。",
    note: "",
    officialUrl: "",
    xiaohongshuUrl: "",
    xiaohongshuNoteTitle: "",
    bookIds: [],
    movieIds: ["movie-002"],
    verificationStatus: "confirmed",
    lastVerified: "2026-10-15",
    lastUpdated: "",
    replays: []
  },
  {
    id: "episode-013",
    episodeNumber: 13,
    title: "发胶",
    englishTitle: "Hairspray",
    kind: "movie",
    releaseDate: "",
    summary: "本期讨论电影《发胶》（Hairspray，2007）——胖女孩特雷西一心要上电视里的舞蹈节目，1962 年的巴尔的摩，她把整座城都搅进了舞池。",
    note: "豆瓣条目为《发胶》，又名《发胶明星梦》《恋爱大爆发》。",
    officialUrl: "",
    xiaohongshuUrl: "",
    xiaohongshuNoteTitle: "",
    bookIds: [],
    movieIds: ["movie-012"],
    verificationStatus: "confirmed",
    lastVerified: "2026-10-15",
    lastUpdated: "",
    replays: []
  },
  {
    id: "episode-014",
    episodeNumber: 14,
    title: "火星救援",
    englishTitle: "The Martian",
    kind: "book",
    releaseDate: "",
    summary: "共读安迪·威尔《火星救援》——宇航员马克被当成遇难者留在火星上，没救援，没补给，他决定在火星上种土豆活下来。",
    note: "",
    officialUrl: "",
    xiaohongshuUrl: "https://www.xiaohongshu.com/explore/6ad24a09000000000a02477b",
    xiaohongshuNoteTitle: "是什么让深爱土豆之人如此伤心？",
    bookIds: ["book-009"],
    movieIds: [],
    verificationStatus: "confirmed",
    lastVerified: "2026-10-15",
    lastUpdated: "",
    replays: []
  },
  {
    id: "episode-015",
    episodeNumber: 15,
    title: "芝加哥",
    englishTitle: "Chicago",
    kind: "movie",
    releaseDate: "",
    summary: "本期讨论电影《芝加哥》——1920 年代的芝加哥，两个杀了人的女人，把谋杀案炒成头条，把法庭变成秀场。",
    note: "",
    officialUrl: "",
    xiaohongshuUrl: "",
    xiaohongshuNoteTitle: "",
    bookIds: [],
    movieIds: ["movie-013"],
    verificationStatus: "confirmed",
    lastVerified: "2026-10-15",
    lastUpdated: "",
    replays: []
  },
  {
    id: "episode-016",
    episodeNumber: 16,
    title: "小鬼当家 2：迷失纽约",
    englishTitle: "Home Alone 2: Lost in New York",
    kind: "movie",
    releaseDate: "",
    summary: "本期讨论电影《小鬼当家 2：迷失纽约》——又一年圣诞，凯文这回在纽约走丢，更大的城市、更豪华的酒店，还有老熟人找上门。",
    note: "",
    officialUrl: "",
    xiaohongshuUrl: "",
    xiaohongshuNoteTitle: "",
    bookIds: [],
    movieIds: ["movie-003"],
    verificationStatus: "confirmed",
    lastVerified: "2026-10-15",
    lastUpdated: "",
    replays: []
  },
  {
    id: "episode-017",
    episodeNumber: 17,
    title: "傲慢与偏见",
    englishTitle: "Pride and Prejudice",
    kind: "book",
    releaseDate: "",
    summary: "共读简·奥斯汀《傲慢与偏见》——一个用误会推开对方，一个用傲慢藏起真心，两个互相喜欢的人差点就这样错过。",
    note: "",
    officialUrl: "",
    xiaohongshuUrl: "https://www.xiaohongshu.com/explore/6ac73c0c0000000018011f4e",
    xiaohongshuNoteTitle: "不完美，才是真实的人",
    bookIds: ["book-011"],
    movieIds: [],
    verificationStatus: "confirmed",
    lastVerified: "2026-10-15",
    lastUpdated: "",
    replays: []
  },
  {
    id: "episode-018",
    episodeNumber: 18,
    title: "歌舞青春",
    englishTitle: "High School Musical series",
    kind: "movie",
    releaseDate: "",
    summary: "本期讨论《歌舞青春》系列——篮球队长和理科女孩在一次合唱里发现彼此，球场和舞台，总要选一个。",
    note: "本期为系列，电影条目收录第一部（2006）。",
    officialUrl: "",
    xiaohongshuUrl: "",
    xiaohongshuNoteTitle: "",
    bookIds: [],
    movieIds: ["movie-014"],
    verificationStatus: "confirmed",
    lastVerified: "2026-10-15",
    lastUpdated: "",
    replays: []
  },
  {
    id: "episode-019",
    episodeNumber: 19,
    title: "了不起的盖茨比",
    englishTitle: "The Great Gatsby",
    kind: "book",
    releaseDate: "",
    summary: "共读 F. S. 菲茨杰拉德《了不起的盖茨比》——爵士时代的纽约，盖茨比隔着海湾夜夜望向那盏绿灯，那是旧爱黛西的方向，也是他用一场场派对堆起来的梦。",
    note: "",
    officialUrl: "",
    xiaohongshuUrl: "",
    xiaohongshuNoteTitle: "",
    bookIds: ["book-012"],
    movieIds: [],
    verificationStatus: "confirmed",
    lastVerified: "2026-10-15",
    lastUpdated: "",
    replays: [
      { url: "https://www.bilibili.com/video/BV1tximBqEuo/", by: "看我闪击印度" }
    ]
  },
  {
    id: "episode-020",
    episodeNumber: 20,
    title: "阿凡达",
    englishTitle: "Avatar",
    kind: "movie",
    releaseDate: "",
    summary: "本期讨论电影《阿凡达》——双腿残疾的士兵进入潘多拉星球，本是为任务而来，却在这片发光的森林里找到想守护的东西。",
    note: "",
    officialUrl: "",
    xiaohongshuUrl: "",
    xiaohongshuNoteTitle: "",
    bookIds: [],
    movieIds: ["movie-004"],
    verificationStatus: "confirmed",
    lastVerified: "2026-10-15",
    lastUpdated: "",
    replays: []
  },
  {
    id: "episode-021",
    episodeNumber: 21,
    title: "尼罗河上的惨案",
    englishTitle: "Death on the Nile",
    kind: "book",
    releaseDate: "",
    summary: "共读阿加莎·克里斯蒂《尼罗河上的惨案》——新婚夫妇登上尼罗河的游轮，蜜月没过完新娘就死了，船上每个人都有嫌疑，波洛要在靠岸前找出凶手。",
    note: "英文原名为 Death on the Nile。",
    officialUrl: "",
    xiaohongshuUrl: "",
    xiaohongshuNoteTitle: "",
    bookIds: ["book-014"],
    movieIds: [],
    verificationStatus: "confirmed",
    lastVerified: "2026-10-15",
    lastUpdated: "",
    replays: [
      { url: "https://www.bilibili.com/video/BV1w84Kz3EhW/", by: "看我闪击印度" }
    ]
  },
  {
    id: "episode-022",
    episodeNumber: 22,
    title: "时空恋旅人",
    englishTitle: "About Time",
    kind: "movie",
    releaseDate: "",
    summary: "本期讨论电影《时空恋旅人》——如果能回到过去重来一次，你还会选现在的人生吗？",
    note: "",
    officialUrl: "",
    xiaohongshuUrl: "",
    xiaohongshuNoteTitle: "",
    bookIds: [],
    movieIds: ["movie-005"],
    verificationStatus: "confirmed",
    lastVerified: "2026-10-15",
    lastUpdated: "",
    replays: []
  },
  {
    id: "episode-023",
    episodeNumber: 23,
    title: "呼啸山庄",
    englishTitle: "Wuthering Heights",
    kind: "book",
    releaseDate: "",
    summary: "共读艾米莉·勃朗特《呼啸山庄》——孤儿希斯克利夫和凯瑟琳在荒原一起长大，他爱她爱得不管不顾——可她嫁给了别人。于是他把余生烧成一场复仇，一直烧到下一代的儿女身上。",
    note: "",
    officialUrl: "",
    xiaohongshuUrl: "",
    xiaohongshuNoteTitle: "",
    bookIds: ["book-016"],
    movieIds: [],
    verificationStatus: "confirmed",
    lastVerified: "2026-10-15",
    lastUpdated: "",
    replays: [
      { url: "https://www.bilibili.com/video/BV1hMk5BaEvu/", by: "看我闪击印度" }
    ]
  },
  {
    id: "episode-024",
    episodeNumber: 24,
    title: "银河系漫游指南",
    englishTitle: "The Hitchhiker's Guide to the Galaxy",
    kind: "book",
    releaseDate: "",
    summary: "共读道格拉斯·亚当斯《银河系漫游指南》——地球要拆迁，他搭上外星人的飞船逃进银河，手里一本指南，连宇宙终极问题的答案都写着——42。",
    note: "",
    officialUrl: "",
    xiaohongshuUrl: "",
    xiaohongshuNoteTitle: "",
    bookIds: ["book-017"],
    movieIds: [],
    verificationStatus: "confirmed",
    lastVerified: "2026-10-15",
    lastUpdated: "",
    replays: [
      { url: "https://www.bilibili.com/video/BV1udXZB1Eeg/", by: "看我闪击印度" }
    ]
  },
  {
    id: "episode-025",
    episodeNumber: 25,
    title: "寄生虫",
    englishTitle: "Parasite",
    kind: "movie",
    releaseDate: "",
    summary: "本期讨论电影《寄生虫》——住在半地下室的四口之家，靠一个个谎言住进富人的大宅，这场寄生游戏每一步都越陷越深。",
    note: "",
    officialUrl: "",
    xiaohongshuUrl: "",
    xiaohongshuNoteTitle: "",
    bookIds: [],
    movieIds: ["movie-006"],
    verificationStatus: "confirmed",
    lastVerified: "2026-10-15",
    lastUpdated: "",
    replays: [
      { url: "https://www.bilibili.com/video/BV1EP5X6HEXV/", by: "看我闪击印度" }
    ]
  },
  {
    id: "episode-026",
    episodeNumber: 26,
    title: "爱玛",
    englishTitle: "Emma",
    kind: "book",
    releaseDate: "",
    summary: "共读简·奥斯汀《爱玛》——艾玛什么都不缺，就爱替别人牵线搭桥，把身边人的婚事安排得明明白白——直到发现自己才是那个最看不清姻缘的人。",
    note: "",
    officialUrl: "",
    xiaohongshuUrl: "",
    xiaohongshuNoteTitle: "",
    bookIds: ["book-019"],
    movieIds: [],
    verificationStatus: "confirmed",
    lastVerified: "2026-10-15",
    lastUpdated: "",
    replays: [
      { url: "https://www.bilibili.com/video/BV1R6KL6QEnc/", by: "看我闪击印度" }
    ]
  },
  {
    id: "episode-027",
    episodeNumber: 27,
    title: "星际穿越",
    englishTitle: "Interstellar",
    kind: "movie",
    releaseDate: "",
    summary: "本期讨论电影《星际穿越》——地球快要不能住人，库珀穿过虫洞为人类找新家，而黑洞另一头，时间过得比地球慢得多。",
    note: "",
    officialUrl: "",
    xiaohongshuUrl: "",
    xiaohongshuNoteTitle: "",
    bookIds: [],
    movieIds: ["movie-007"],
    verificationStatus: "confirmed",
    lastVerified: "2026-10-15",
    lastUpdated: "",
    replays: [
      { url: "https://www.bilibili.com/video/BV15mYX6oEq2/", by: "两站联合中字" }
    ]
  },
  {
    id: "episode-028",
    episodeNumber: 28,
    title: "血字的研究",
    englishTitle: "A Study in Scarlet",
    kind: "book",
    releaseDate: "",
    summary: "共读阿瑟·柯南·道尔《血字的研究》——福尔摩斯与华生的第一次见面：一间贝克街的合租房，和一桩写着血字的命案。",
    note: "",
    officialUrl: "",
    xiaohongshuUrl: "",
    xiaohongshuNoteTitle: "",
    bookIds: ["book-021"],
    movieIds: [],
    verificationStatus: "confirmed",
    lastVerified: "2026-10-15",
    lastUpdated: "",
    replays: [
      { url: "https://www.bilibili.com/video/BV1SpYF6AEV5/", by: "两站联合中字" },
      { url: "https://www.bilibili.com/video/BV1FYem6dEpA/", by: "看我闪击印度" }
    ]
  },
  {
    id: "episode-guanshu",
    episodeNumber: null,
    title: "番外 · 逛书架",
    englishTitle: "",
    kind: "extra",
    releaseDate: "",
    summary: "本期番外：逛书架，集中介绍一批书——从《了不起的盖茨比》《蝴蝶梦》等经典，到《密林勿近》《黛西与乐队》这样的近年新作。",
    note: "",
    officialUrl: "",
    xiaohongshuUrl: "https://www.xiaohongshu.com/explore/6ac1d9ca000000000b005045",
    xiaohongshuNoteTitle: "LLTP番外：KPOP传奇爱书人Lily的书单大放送",
    noteKind: "shelf",
    bookIds: ["book-012", "book-029", "book-030", "book-031", "book-032", "book-033", "book-034"],
    movieIds: [],
    verificationStatus: "needs-review",
    lastVerified: "",
    lastUpdated: "",
    replays: [
      { url: "https://www.bilibili.com/video/BV1vgkCB9E9K/", by: "看我闪击印度" }
    ]
  },
  {
    id: "episode-frankenstein",
    episodeNumber: null,
    title: "第 29 期预告 · 弗兰肯斯坦",
    englishTitle: "Frankenstein",
    kind: "extra",
    preview: true,          // 预告：笔记只在预告详情页显示，不进首页「精选」
    releaseDate: "",
    summary: "第 29 期预告：玛丽·雪莱《弗兰肯斯坦》——科学家维克多用尸块造出生命，又因为恐惧抛弃了它，从此被自己造出的怪物纠缠。",
    note: "第 29 期预告，正片播出后更新。",
    officialUrl: "",
    xiaohongshuUrl: "https://www.xiaohongshu.com/explore/6ac36c2a000000000a025848",
    xiaohongshuNoteTitle: "LLTP#29预告 《弗兰肯斯坦》",
    bookIds: ["book-037"],
    movieIds: [],
    verificationStatus: "needs-review",
    lastVerified: "",
    lastUpdated: "",
    replays: []
  }
];

/**
 * 「Lily带你读好书」系列笔记的作者署名。
 * 站内所有小红书笔记（单本笔记 / 书架合集 / 书单合集）都由本人制作。
 */
window.NOTE_AUTHOR = "缘浅";

/**
 * 全站置顶公告：打开网站时最上方展示。
 * 用于「下一期预告」「新一期已发布」这类需要第一时间被看到的消息。
 *
 * 维护方法：
 *   active 置 false 即整条公告不显示；
 *   新一期发布后，把 label/title/text/episodeId 改成新一期（或直接 active:false）。
 */
window.SITE_NOTICE = {
  active: true,
  label: "下一期预告",
  title: "第 29 期预告 · 弗兰肯斯坦",
  text: "玛丽·雪莱《弗兰肯斯坦》——预告已放出，正片发布后这里会更新。",
  episodeId: "episode-frankenstein",
  updatedAt: ""
};

/**
 * 系列级笔记（不属于某一期，而是整个系列的目录 / 总览）。
 * 会出现在首页「精选」区块。
 */
window.SERIES_NOTES = [
  {
    kind: "list",
    title: "KPOP和读书之间的伟大桥梁",
    scope: "全系列 · 28 期总览",
    url: "https://www.xiaohongshu.com/explore/6ac0c2c5000000000a022597"
  }
];
