-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- 主機： mysql:3306
-- 產生時間： 2024 年 04 月 28 日 12:01
-- 伺服器版本： 8.0.36
-- PHP 版本： 8.2.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 資料庫： `library_system`
--

-- --------------------------------------------------------

--
-- 資料表結構 `announcement`
--

CREATE TABLE `announcement` (
  `ID` int NOT NULL COMMENT '公告id',
  `title` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL COMMENT '公告標題',
  `message` text CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL COMMENT '公告詳細訊息',
  `annouceTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '公告時間',
  `sent_to` varchar(10) DEFAULT NULL COMMENT '傳送對象'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- 資料表結構 `blacklist`
--

CREATE TABLE `blacklist` (
  `userID` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL,
  `username` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL,
  `reason` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- 資料表結構 `book`
--

CREATE TABLE `book` (
  `ISBN` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL,
  `stock_num` int NOT NULL COMMENT '目前庫存數量',
  `borrowed_num` int NOT NULL COMMENT '目前借出的數量',
  `bookName` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL,
  `bookClass` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL DEFAULT '無',
  `author` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL,
  `publisher` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL,
  `publishYear` int NOT NULL,
  `describeBook` varchar(10000) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- 傾印資料表的資料 `book`
--

INSERT INTO `book` (`ISBN`, `stock_num`, `borrowed_num`, `bookName`, `bookClass`, `author`, `publisher`, `publishYear`, `describeBook`) VALUES
('9789574554089', 4, 0, '老人與海', '無', '厄尼斯特．海明威', '晨星', 2003, '<P>　　本書獲一九五三年普立茲文學獎、一九五四年諾貝爾文學獎，是海洋文學代表作，也是海明威畢生文學成就的總結。</P><P>　　老人一連八十四天毫無所獲，就在第八十五天早上，他捕到了一條比船還大的馬林魚。經過兩個晝夜的奮戰，老人終於制伏了大魚。可是，鯊魚群立刻過來搶奪他的戰利品，老人雖然竭盡全力與鯊魚搏鬥，大魚仍難逃被吃光的命運，老人最後只拖回一副魚骨頭……</P><P>　　海明威以精鍊的文字、細膩的筆觸，生動地刻劃老漁夫和大魚搏鬥、和大自然對決的過程，老漁夫最後雖然毫無所獲，他不被乖舛命運擊敗的毅力卻是值得歌頌的。</P><P>　　《老人與海》出版四十八小時銷售五百三十萬冊，創下出版史上的紀錄，不僅使海明威成了美國最偉大的作家之一，也使他成為了二十世紀世界文壇的傳奇人物。</P><P><STRONG>作者簡介</STRONG></P><P><STRONG>厄尼斯特．海明威(Ernest Hemingway, 1899-1961)</STRONG></P><P>　　美國近代小說家。二十世紀最傑出的作家之一，獲1954年諾貝爾文學獎。 1899年出生於伊利諾州芝加哥的橡樹園鎮，父親是醫生，母親是聲樂家。從小喜歡釣魚、打獵、音樂和繪畫。曾加入紅十字會任救護車司機、戰地記者，過著多采多姿的生活，終生以寫作為職志。晚年患多種疾病，精神抑鬱，1961年在自家住宅用獵槍自殺，結束了一生。主要作品有《老人與海》、《戰地春夢》、《戰地鐘聲》、《雪山盟》、《旭日又東升》、《沒有女人的男人》、《我們的時代》等。</P>'),
('9789865253431', 3, 0, '信義學 ﹕ESG先行者10個有溫度的創新', '無', '陳建豪', '天下文化', 2021, '<div style=\"text-align: center;\"><strong>揭開第一名房仲信義房屋四十年的經營心法與成功祕訣！<br>信義房屋 ﹕比你還在意你的事，創造無可取代的信任！<br><br>信義深知賣的不只是房子，是家，是信任，<br>是人情，是人與人之間的情感聯繫，<br>因為家健全了，有了溫度，人與人之間有更緊密的關係，<br>社會才能正向發展，這塊土地上的人才會好，企業也才能茁壯。</strong></div><br>　　從創業第一天，信義房屋就堅持走一條不一樣的路，<br>　　不僅以先義後利、以人為本、正向思考做為經營理念，<br>　　更從三十多年前開始就走在眾人之前，一步一腳印的實踐ESG的理念，<br>　　不僅每一個創新都是從誠信出發，每一次交易都是真心對待客戶在意的事，<br>　　更看重腳底下的一草一木，努力為生活其中的人們打造更好的環境，帶來幸福，<br>　　本書揭開信義房屋如何扭轉房仲業樣貌，真誠待客、成就夥伴、打造永續環境，<br>　　成為房仲第一品牌及ESG標竿企業的成功心法！<br><br><strong>信任推薦</strong><br><br>　　政大名譽講座教授　司徒達賢、政大企管系特聘教授　別蓮蒂、逢甲大學人言講座教授　許士軍、台灣地方創生基金會董事長　陳美伶、綠藤生機共同創辦人暨執行長　鄭涵睿、企業講師、作家、主持人　謝文憲、AAMA 台北搖籃計畫共同創辦人 / 校長　顏漏有、鮮乳坊創辦人暨大動物獸醫　龔建嘉<br> '),
('9789865522506', 2, 0, '作業系統 Asia Edition (10版)', '無', 'Silberschatz,Galvin,Gagne', '東華', 2021, '        　　近年來隨著雲端平台與行動裝置的普及，讓第十版與之前的版本內容有相當大幅度的改版，在雲端平台方面增加：多核心計算環境 NUMA 系統和 Hadoop 叢集介紹；在虛擬機方面的描述包含容器及 Docker，另外對於分散式檔案系統討論 Google 檔案系統、Hadoop 及 GPFS；並對 CPU 排班特別探討多層級佇列與多核心處理器的排班處理，針對行程與資源的衝突方面，除了傳統的“死結”之外，也新增“活結”的討論。在行動裝置方面：新增行動作業系統 Android 和 iOS 的章節內容討論。這次新版本有相當多的內容更新，所以不論新舊讀者都很推薦再次閱讀本書。<br><br>　　本書內容可以讓讀者瞭解到傳統的 PC 與伺服器所使用的作業系統，如 Linux、Microsoft Windows、Apple macOS 和 Solaris，以及 Android 和 iOS 兩種行動作業系統。本書也列舉一些由 C 語言或 Java 撰寫的範例程式讓讀者可以更直觀瞭解理論的結果。書中的案例能提供研究生或工程師更深入瞭解 Linux 和 Windows 10 作業系統設計架構，其中Windows API 亦使用本書所提供的 C 語言程式來測試行程、記憶體和周邊設備。另外可安裝 Linux 虛擬機來執行 Ubuntu，透過本書將完成 Linux 4.i 的核心練習。最後期待讀者經過本書的引導，藉由「做中學」得到更多的啟發！<br><br> '),
('9789869613262', 1, 0, '全面動起來！搶救韓國瑜', '無', '王晴天', '集夢坊', 2019, '        　　值此危急存亡之秋，全面動起來！搶救韓國瑜！<br>　　全力支持唯一能實現「台灣安全，人民有錢」的總統候選人！<br><br>　　昨夜西風凋碧樹。獨上高樓，望盡天涯路<br>　　──他，經歷過人生的潮起潮落，對未來仍充滿無限希望與鬥志<br><br>　　衣帶漸寬終不悔，為伊消得人憔悴<br>　　──他，雖因政治惡鬥而生活顛簸，卻無怨無悔<br><br>　　眾里尋他千百度，驀然回首，那人卻在燈火闌珊處<br>　　──他，落魄了十餘年，決心再拼一次，終於水到渠成，成就庶民政治奇蹟<br><br>　　驀然回首，所有的韓粉仍在燈火闌珊處相守啊！<br><br>　　本書從「支持韓國瑜的十大理由」切入，輔以韓國瑜的生平傳記、其成功的借力與途徑，最後簡介韓國瑜的發跡地、這個近90萬支持者的港都──高雄。<br><br>　　若深入探究韓國瑜的成功原因，除了他本身具備獨特的人格魅力以外，也與他神級的公眾演說技巧息息相關。本書作者Jacky Wang也利用自己身為「世界華人八大明師首席講師」的公眾演說長才，深入剖析韓國瑜神級的演講秘方，讓讀者在支持韓國瑜之餘，也能增進自己的技藝，進而登上成功之巔！<br> ');

-- --------------------------------------------------------

--
-- 資料表結構 `users`
--

CREATE TABLE `users` (
  `username` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL,
  `userID` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL COMMENT '學號',
  `email` varchar(100) NOT NULL,
  `password` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL,
  `token` varchar(100) NOT NULL,
  `status` varchar(100) NOT NULL,
  `regTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `forgettoken` varchar(100) DEFAULT NULL,
  `admin` varchar(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- 傾印資料表的資料 `users`
--

INSERT INTO `users` (`username`, `userID`, `email`, `password`, `token`, `status`, `regTime`, `forgettoken`, `admin`) VALUES
('官老大', '00857006', '00857006@mail.ntou.edu.tw', '111111', '98687d395281c7734472bad2e1f20423', '1', '2021-12-29 15:30:04', NULL, ''),
('008570200', '00857020', '00857020@mail.ntou.edu.tw', '111111', '92cfe88d1478178766ca41e609ecf1c2', '1', '2021-12-29 17:24:53', NULL, ''),
('陳冠樺', '00857029', '00857029@mail.ntou.edu.tw', '111111', 'e1db54caf7eb0f6c67e2febe63593cf0', '2', '2021-12-27 14:43:08', NULL, '1'),
('凱凱', '00857039', '00857039@mail.ntou.edu.tw', '111111', '', '1', '2024-03-15 13:11:42', NULL, '');

-- --------------------------------------------------------

--
-- 資料表結構 `user_book_history`
--

CREATE TABLE `user_book_history` (
  `userID` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL,
  `ISBN` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL,
  `borrowing_num` int NOT NULL,
  `start_rent_date` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL,
  `lasting_return_date` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL,
  `return_date` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- 資料表結構 `user_condition`
--

CREATE TABLE `user_condition` (
  `userID` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL,
  `book_num` int NOT NULL,
  `book_time` int NOT NULL,
  `book_fine` float NOT NULL,
  `credit` int NOT NULL,
  `renting_book_num` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- 傾印資料表的資料 `user_condition`
--

INSERT INTO `user_condition` (`userID`, `book_num`, `book_time`, `book_fine`, `credit`, `renting_book_num`) VALUES
('00857006', 3, 15, 2, 0, 0),
('00857020', 3, 15, 1, -1, 0),
('00857029', 4, 15, 1, 1, 0),
('00857039', 4, 15, 1, 2, 0);

-- --------------------------------------------------------

--
-- 資料表結構 `user_favorite_book_data`
--

CREATE TABLE `user_favorite_book_data` (
  `userID` varchar(10) CHARACTER SET utf8mb3 COLLATE utf8mb3_croatian_ci NOT NULL,
  `ISBN` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_croatian_ci NOT NULL,
  `bookName` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_croatian_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_croatian_ci;

--
-- 已傾印資料表的索引
--

--
-- 資料表索引 `announcement`
--
ALTER TABLE `announcement`
  ADD PRIMARY KEY (`ID`);

--
-- 資料表索引 `blacklist`
--
ALTER TABLE `blacklist`
  ADD PRIMARY KEY (`userID`);

--
-- 資料表索引 `book`
--
ALTER TABLE `book`
  ADD PRIMARY KEY (`ISBN`);

--
-- 資料表索引 `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userID`);

--
-- 資料表索引 `user_book_history`
--
ALTER TABLE `user_book_history`
  ADD PRIMARY KEY (`userID`,`ISBN`,`start_rent_date`);

--
-- 資料表索引 `user_condition`
--
ALTER TABLE `user_condition`
  ADD PRIMARY KEY (`userID`) USING BTREE;

--
-- 資料表索引 `user_favorite_book_data`
--
ALTER TABLE `user_favorite_book_data`
  ADD PRIMARY KEY (`userID`,`ISBN`);

--
-- 在傾印的資料表使用自動遞增(AUTO_INCREMENT)
--

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `announcement`
--
ALTER TABLE `announcement`
  MODIFY `ID` int NOT NULL AUTO_INCREMENT COMMENT '公告id', AUTO_INCREMENT=57;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
