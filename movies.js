/**
 * LLTP Archive · 电影数据（轻量索引）
 * ------------------------------------------------------------
 * 电影采用**独立于书籍的数据结构**，只保留索引级信息：
 * 片名 / 原名 / 年份 / 导演 / 关联期数 / 一句话说明 / 来源链接。
 * 刻意不包含：完整剧情、演员表、剧照、评分、影评、播放平台。
 *
 * 数据说明：
 * - 片名 / 年份 / 导演 / 豆瓣条目，来自豆瓣电影条目页本人核对（2026-10-15）。
 * - 与 LLTP 期数的对应关系，来自粉丝整理的 LLTP 期数表 + 小百合研究所推书/电影合集。
 *   全部 14 部电影均已确认所属期数，不再有「期数待补」。
 * - note 记录译名差异，避免读者对不上号。
 *
 * verificationStatus："confirmed" 已核对 | "needs-review" 待核对
 * relatedBookIds：跨媒介专题关联（P2 功能），目前全部留空。
 */
window.MOVIES = [
  {
    id: "movie-001",
    title: "本杰明·巴顿奇事",
    originalTitle: "The Curious Case of Benjamin Button",
    year: 2008,
    director: "大卫·芬奇",
    cover: "",
    doubanUrl: "https://movie.douban.com/subject/1485260/",
    episodeIds: ["episode-005"],
    summary: "改编自菲茨杰拉德同名短篇，讲述本杰明·巴顿逆向衰老的一生。",
    note: "本片也译作《返老还童》。",
    sources: [
      { label: "粉丝整理 LLTP 期数表", url: "" },
      { label: "豆瓣条目页", url: "https://movie.douban.com/subject/1485260/" }
    ],
    xiaohongshuUrl: "",
    xiaohongshuNoteTitle: "",
    relatedBookIds: [],
    verificationStatus: "confirmed",
    lastVerified: "2026-10-15",
    lastUpdated: "",
    imageSource: "",
    rightsStatus: "placeholder",
    licenseNote: ""
  },
  {
    id: "movie-002",
    title: "小鬼当家",
    originalTitle: "Home Alone",
    year: 1990,
    director: "克里斯·哥伦布",
    cover: "",
    doubanUrl: "https://movie.douban.com/subject/1293088/",
    episodeIds: ["episode-012"],
    summary: "男孩凯文独自在家，用机关击退入室小偷。",
    note: "",
    sources: [
      { label: "粉丝整理 LLTP 期数表", url: "" },
      { label: "豆瓣条目页", url: "https://movie.douban.com/subject/1293088/" }
    ],
    xiaohongshuUrl: "",
    xiaohongshuNoteTitle: "",
    relatedBookIds: [],
    verificationStatus: "confirmed",
    lastVerified: "2026-10-15",
    lastUpdated: "",
    imageSource: "",
    rightsStatus: "placeholder",
    licenseNote: ""
  },
  {
    id: "movie-003",
    title: "小鬼当家 2：迷失纽约",
    originalTitle: "Home Alone 2: Lost in New York",
    year: 1992,
    director: "克里斯·哥伦布",
    cover: "",
    doubanUrl: "https://movie.douban.com/subject/1293353/",
    episodeIds: ["episode-016"],
    summary: "《小鬼当家》续集，凯文在纽约再次独自应对小偷。",
    note: "",
    sources: [
      { label: "粉丝整理 LLTP 期数表", url: "" },
      { label: "豆瓣条目页", url: "https://movie.douban.com/subject/1293353/" }
    ],
    xiaohongshuUrl: "",
    xiaohongshuNoteTitle: "",
    relatedBookIds: [],
    verificationStatus: "confirmed",
    lastVerified: "2026-10-15",
    lastUpdated: "",
    imageSource: "",
    rightsStatus: "placeholder",
    licenseNote: ""
  },
  {
    id: "movie-004",
    title: "阿凡达",
    originalTitle: "Avatar",
    year: 2009,
    director: "詹姆斯·卡梅隆",
    cover: "",
    doubanUrl: "https://movie.douban.com/subject/1652587/",
    episodeIds: ["episode-020"],
    summary: "讲述潘多拉星球上的纳美人与其家园。",
    note: "",
    sources: [
      { label: "粉丝整理 LLTP 期数表", url: "" },
      { label: "豆瓣条目页", url: "https://movie.douban.com/subject/1652587/" }
    ],
    xiaohongshuUrl: "",
    xiaohongshuNoteTitle: "",
    relatedBookIds: [],
    verificationStatus: "confirmed",
    lastVerified: "2026-10-15",
    lastUpdated: "",
    imageSource: "",
    rightsStatus: "placeholder",
    licenseNote: ""
  },
  {
    id: "movie-005",
    title: "时空恋旅人",
    originalTitle: "About Time",
    year: 2013,
    director: "理查德·柯蒂斯",
    cover: "",
    doubanUrl: "https://movie.douban.com/subject/10577869/",
    episodeIds: ["episode-022"],
    summary: "讲述能穿越时间的蒂姆对爱情与生活的选择。",
    note: "",
    sources: [
      { label: "粉丝整理 LLTP 期数表", url: "" },
      { label: "豆瓣条目页", url: "https://movie.douban.com/subject/10577869/" }
    ],
    xiaohongshuUrl: "",
    xiaohongshuNoteTitle: "",
    relatedBookIds: [],
    verificationStatus: "confirmed",
    lastVerified: "2026-10-15",
    lastUpdated: "",
    imageSource: "",
    rightsStatus: "placeholder",
    licenseNote: ""
  },
  {
    id: "movie-006",
    title: "寄生虫",
    originalTitle: "Parasite",
    year: 2019,
    director: "奉俊昊",
    cover: "",
    doubanUrl: "https://movie.douban.com/subject/27010768/",
    episodeIds: ["episode-025"],
    summary: "讲述底层一家人逐步渗入富人家庭的故事。",
    note: "",
    sources: [
      { label: "粉丝整理 LLTP 期数表", url: "" },
      { label: "豆瓣条目页", url: "https://movie.douban.com/subject/27010768/" }
    ],
    xiaohongshuUrl: "",
    xiaohongshuNoteTitle: "",
    relatedBookIds: [],
    verificationStatus: "confirmed",
    lastVerified: "2026-10-15",
    lastUpdated: "",
    imageSource: "",
    rightsStatus: "placeholder",
    licenseNote: ""
  },
  {
    id: "movie-007",
    title: "星际穿越",
    originalTitle: "Interstellar",
    year: 2014,
    director: "克里斯托弗·诺兰",
    cover: "",
    doubanUrl: "https://movie.douban.com/subject/1889243/",
    episodeIds: ["episode-027"],
    summary: "讲述人类为求生穿越虫洞寻找新家园。",
    note: "",
    sources: [
      { label: "粉丝整理 LLTP 期数表", url: "" },
      { label: "豆瓣条目页", url: "https://movie.douban.com/subject/1889243/" }
    ],
    xiaohongshuUrl: "",
    xiaohongshuNoteTitle: "",
    relatedBookIds: [],
    verificationStatus: "confirmed",
    lastVerified: "2026-10-15",
    lastUpdated: "",
    imageSource: "",
    rightsStatus: "placeholder",
    licenseNote: ""
  },
  {
    id: "movie-008",
    title: "再次出发之纽约遇见你",
    originalTitle: "Begin Again",
    year: 2013,
    director: "约翰·卡尼",
    cover: "",
    doubanUrl: "https://movie.douban.com/subject/6874403/",
    episodeIds: ["episode-003"],
    summary: "失意的音乐人和制作人在纽约共同录制专辑。",
    note: "",
    sources: [
      { label: "粉丝整理 LLTP 期数表", url: "" },
      { label: "豆瓣条目页", url: "https://movie.douban.com/subject/6874403/" }
    ],
    xiaohongshuUrl: "",
    xiaohongshuNoteTitle: "",
    relatedBookIds: [],
    verificationStatus: "confirmed",
    lastVerified: "2026-10-15",
    lastUpdated: "",
    imageSource: "",
    rightsStatus: "placeholder",
    licenseNote: ""
  },
  {
    id: "movie-009",
    title: "爱乐之城",
    originalTitle: "La La Land",
    year: 2016,
    director: "达米恩·查泽雷",
    cover: "",
    doubanUrl: "https://movie.douban.com/subject/25934014/",
    episodeIds: ["episode-002"],
    summary: "讲述洛杉矶两位追梦人的爱情与选择。",
    note: "",
    sources: [
      { label: "粉丝整理 LLTP 期数表", url: "" },
      { label: "豆瓣条目页", url: "https://movie.douban.com/subject/25934014/" }
    ],
    xiaohongshuUrl: "",
    xiaohongshuNoteTitle: "",
    relatedBookIds: [],
    verificationStatus: "confirmed",
    lastVerified: "2026-10-15",
    lastUpdated: "",
    imageSource: "",
    rightsStatus: "placeholder",
    licenseNote: ""
  },
  {
    id: "movie-010",
    title: "马戏之王",
    originalTitle: "The Greatest Showman",
    year: 2017,
    director: "迈克尔·格雷西",
    cover: "",
    doubanUrl: "https://movie.douban.com/subject/3914513/",
    episodeIds: ["episode-007"],
    summary: "讲述马戏团创办人巴纳姆的故事。",
    note: "",
    sources: [
      { label: "粉丝整理 LLTP 期数表", url: "" },
      { label: "豆瓣条目页", url: "https://movie.douban.com/subject/3914513/" }
    ],
    xiaohongshuUrl: "",
    xiaohongshuNoteTitle: "",
    relatedBookIds: [],
    verificationStatus: "confirmed",
    lastVerified: "2026-10-15",
    lastUpdated: "",
    imageSource: "",
    rightsStatus: "placeholder",
    licenseNote: ""
  },
  {
    id: "movie-011",
    title: "梦女孩",
    originalTitle: "Dreamgirls",
    year: 2006,
    director: "比尔·康顿",
    cover: "",
    doubanUrl: "https://movie.douban.com/subject/1792922/",
    episodeIds: ["episode-010"],
    summary: "讲述三姐妹组合在乐坛的起落。",
    note: "豆瓣条目为《梦女孩》，又名《追梦女郎》。",
    sources: [
      { label: "粉丝整理 LLTP 期数表", url: "" },
      { label: "豆瓣条目页", url: "https://movie.douban.com/subject/1792922/" }
    ],
    xiaohongshuUrl: "",
    xiaohongshuNoteTitle: "",
    relatedBookIds: [],
    verificationStatus: "confirmed",
    lastVerified: "2026-10-15",
    lastUpdated: "",
    imageSource: "",
    rightsStatus: "placeholder",
    licenseNote: ""
  },
  {
    id: "movie-012",
    title: "发胶",
    originalTitle: "Hairspray",
    year: 2007,
    director: "亚当·山克曼",
    cover: "",
    doubanUrl: "https://movie.douban.com/subject/1946867/",
    episodeIds: ["episode-013"],
    summary: "讲述少女特雷西争取登上舞蹈节目。",
    note: "豆瓣条目为《发胶》，又名《发胶明星梦》《恋爱大爆发》。",
    sources: [
      { label: "粉丝整理 LLTP 期数表", url: "" },
      { label: "豆瓣条目页", url: "https://movie.douban.com/subject/1946867/" }
    ],
    xiaohongshuUrl: "",
    xiaohongshuNoteTitle: "",
    relatedBookIds: [],
    verificationStatus: "confirmed",
    lastVerified: "2026-10-15",
    lastUpdated: "",
    imageSource: "",
    rightsStatus: "placeholder",
    licenseNote: ""
  },
  {
    id: "movie-013",
    title: "芝加哥",
    originalTitle: "Chicago",
    year: 2002,
    director: "罗伯·马歇尔",
    cover: "",
    doubanUrl: "https://movie.douban.com/subject/1307697/",
    episodeIds: ["episode-015"],
    summary: "讲述 1920 年代芝加哥两名女性谋杀案与媒体炒作。",
    note: "",
    sources: [
      { label: "粉丝整理 LLTP 期数表", url: "" },
      { label: "豆瓣条目页", url: "https://movie.douban.com/subject/1307697/" }
    ],
    xiaohongshuUrl: "",
    xiaohongshuNoteTitle: "",
    relatedBookIds: [],
    verificationStatus: "confirmed",
    lastVerified: "2026-10-15",
    lastUpdated: "",
    imageSource: "",
    rightsStatus: "placeholder",
    licenseNote: ""
  },
  {
    id: "movie-014",
    title: "歌舞青春",
    originalTitle: "High School Musical",
    year: 2006,
    director: "肯尼·奥特加",
    cover: "",
    doubanUrl: "https://movie.douban.com/subject/1765009/",
    episodeIds: ["episode-018"],
    summary: "讲述高中生加布里埃拉与特洛伊的音乐剧选角。",
    note: "本期聊的是系列，此处收录第一部（2006）。",
    sources: [
      { label: "粉丝整理 LLTP 期数表", url: "" },
      { label: "豆瓣条目页", url: "https://movie.douban.com/subject/1765009/" }
    ],
    xiaohongshuUrl: "",
    xiaohongshuNoteTitle: "",
    relatedBookIds: [],
    verificationStatus: "confirmed",
    lastVerified: "2026-10-15",
    lastUpdated: "",
    imageSource: "",
    rightsStatus: "placeholder",
    licenseNote: ""
  }
];
