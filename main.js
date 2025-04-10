

const SAMPLE_TEXT = `
L14	28 名誉ポイントを稼ぐ	0 / 28	+8456⭐
+20.3⚡
L11	レベル 中級 のゲームを 18回クリアする	0 / 18	+664🟡
+16.0⚡
`;

function changeDelayText(tar, newtext, time = 2){
	const defaultText = tar.textContent;
	tar.textContent = newtext;
	setTimeout(() => {
		tar.textContent = defaultText;
	}, time * 1000);
}
function makeArticle(param){
	const article = document.createElement("article");
	article.id = param["articleID"];
	document.querySelector("main").append(article);
	
	{
		const header = document.createElement("header");
		article.append(header);
		const h2 = document.createElement("h2");
		h2.textContent = param["articleTitle"];
		header.append(h2);
		{
			const anc = document.createElement("a");
			anc.href = `#${article.id}`;
			anc.textContent = h2.textContent;
			const li = document.createElement("li");
			li.append(anc);
			document.getElementById("toolList").append(li);
		}
		if(param["headers"]){
			header.append(param["headers"]);
		}
		const button = document.createElement("button");
		button.type = "button";
		button.textContent = "クリア🆑";
		button.addEventListener("click", () => {
			article.querySelectorAll(":is(textarea, input)").forEach(ele => ele.value = "");
			
			changeDelayText(button, "クリアしました！😊");
		});
		h2.append(button);
	}
	
	
	{
		const wrapper = document.createElement("div");
		wrapper.classList.add("inputArea");
		article.append(wrapper);
		{
			if(param["fieldsets"]){
				wrapper.append(param["fieldsets"]);
			}
			const textarea = document.createElement("textarea");
			textarea.value = SAMPLE_TEXT;
			wrapper.append(textarea);
			const button = document.createElement("button");
			button.type = "button";
			button.textContent = "⏬変換する⏬";
			button.addEventListener("click", () => {
				const tv = textarea.value;
				if(!tv){
					alert("⚠クエストデータが入力されていません。");
					return;
				}
				let ov = splitQuests_bass(tv);
				if(param["modifyFunction"]){
					ov = param["modifyFunction"](ov);
				}
				article.querySelector(".outputArea > textarea").value = ov;
				
				if(event.isTrusted){
					changeDelayText(button, "変換しました！😊");
				}
			});
			wrapper.append(button);
			setTimeout(() => {
				button.click();
			}, 1);
		}
	}
	{
		const wrapper = document.createElement("div");
		wrapper.classList.add("outputArea");
		article.append(wrapper);
		{
			const textarea = document.createElement("textarea");
			wrapper.append(textarea);
			const button = document.createElement("button");
			button.type = "button";
			button.textContent = "📝コピーする📝";
			button.addEventListener("click", () => {
				textarea.select();
				document.execCommand("copy");
				window.getSelection?.().removeAllRanges();
				textarea.blur();
				
				changeDelayText(button, "コピーしました！😊");
			});
			wrapper.append(button);
		}
	}
	const hr = document.createElement("hr");
	article.append(hr);
}


makeArticle({
	"articleID": "normalChanger",
	"articleTitle": "簡単整形",
	"headers": null,
	"fieldsets": null,
	"modifyFunction": function(texts){
		return texts.map((text) => text.join("\t")).join("\n");
	},
});
makeArticle({
	"articleID": "abstractChanger",
	"articleTitle": "クエスト文言要約",
	"headers": (() => {
		const fragment = document.createDocumentFragment();
		const p = document.createElement("p");
		p.textContent = "現段階で友好イベントで出るクエストにしか対応させていないです。";
		fragment.append(p);
		return fragment;
	})(),
	"fieldsets": null,
	"modifyFunction": function(texts){
		texts = abstractDetail(texts);
		return texts.map((text) => text.join("\t")).join("\n");
	},
});

makeArticle({
	"articleID": "changerMissionImpossible",
	"articleTitle": "ウィキのミッションインポッシブルのページ用に整形",
	"headers": (() => {
		const fragment = document.createDocumentFragment();
		{
			const p = document.createElement("p");
 			const anc = document.createElement("a");
			anc.href = "https://w.atwiki.jp/minesweeper-online/pages/120.html#id_1137305e";
			anc.textContent = "ミッション：インポッシブル - マインスイーパーオンライン　アットウィキ";
			anc.setAttribute("target", "_blank");
			anc.setAttribute("rel", "noopener noreferrer");
			p.append(anc);
			p.append(document.createTextNode("の形式へ整形します。"));
			fragment.append(p);
 		}
		{
			const p = document.createElement("p");
 			p.append(document.createTextNode("匿名でご提供くださる場合は"));
 			const anc = document.createElement("a");
			anc.href = "https://minesweeper.online/ja/player/16842796";
			anc.textContent = "魚頭男";
			anc.setAttribute("target", "_blank");
			anc.setAttribute("rel", "noopener noreferrer");
			p.append(anc);
			p.append(document.createTextNode("までご連絡おねがいします。"));
			fragment.append(p);
		}
		return fragment;
	})(),
	"fieldsets": (() => {
		const fieldset = document.createElement("fieldset");
		{
			const label = document.createElement("label");
			fieldset.append(label);
			const span = document.createElement("span");
			span.textContent = "お名前";
			label.append(span);
			const input = document.createElement("input");
			input.type = "text";
			input.value = "魚頭男";
			input.classList.add("playername_string");
			label.append(input);
		}
		{
			const label = document.createElement("label");
			fieldset.append(label);
			const span = document.createElement("span");
			span.textContent = "プレイヤーリンク";
			label.append(span);
			const input = document.createElement("input");
			input.type = "text";
			input.value = "https://minesweeper.online/ja/player/16842796";
			input.classList.add("playerlink_string");
			label.append(input);
		}
		{
			const label = document.createElement("label");
			fieldset.append(label);
			const span = document.createElement("span");
			span.textContent = "シーズン";
			label.append(span);
			const input = document.createElement("input");
			input.type = "text";
			input.value = "S121";
			input.classList.add("season_string");
			label.append(input);
		}
		return fieldset;
	})(),
	"modifyFunction": function(texts){
		
		const field = event.currentTarget.closest(".inputArea");
		const playerlink = field.querySelector(".playerlink_string").value;
		const season = field.querySelector(".season_string").value;
		const playername = field.querySelector(".playername_string").value;
		const reg = new RegExp("^https://minesweeper.online/ja/player/\\d+$");
		{
			const errors = [];
			if(!playername){
				errors.push("お名前が入力されていません。");
			}
			if(!season){
				errors.push("シーズンが入力されていません。");
			}
			if(!playerlink.match(reg)){
				errors.push("プレイヤーリンクが正しくありません。");
			}
			if(errors.length){
				alert(errors.map((error) => `⚠${error}`).join("\n"));
				null.poo();	/*エラー*/
			}
		}
		
		const kinds = getKinds(texts);
		const newTexts = texts.map((text, index) => {
			let ta = [];
			ta[0] = text[0].replace("L", "");
			ta[1] = text[1];
			ta[2] = season;
			ta[3] = "";	/*コメント*/
			ta[4] = playername;
			ta = ta.concat(kinds[index]);
			return ta;
		});
		const ra = [];
		ra.push(`-${playername}（[[>>${playerlink}]]）`);
		ra.push("");
		ra.push(newTexts.map((text) => `|${text.join("|")}|`).join("\n"));
		return ra.join("\n");
	},
});

function splitQuests_bass(text){
	const texts = text.split("\n").filter((str) => str.match(/L\d/)).map((str) => {
		const ta = str.split("\t");
		const ra = [];
		ra[0] = ta[0];
		ra[1] = ta[1];
		return ra;
	});
	return texts;
}


function getKinds(texts){
	const MOD_DATAS = [
		{
			"trigger": "名誉",
			"func": ((text) => {
				return ["資源", "名誉ポイント", "＊",];
			}),
		},
		{
			"trigger": "宝石",
			"func": ((text) => {
				return ["資源", "宝石", "＊",];
			}),
		},
		{
			"trigger": "アリーナコイン",
			"func": ((text) => {
				return ["アリーナ", "アリーナコイン", "＊",];
			}),
		},
		{
			"trigger": "コイン",
			"func": ((text) => {
				return ["資源", "コイン", "＊",];
			}),
		},
		{
			"trigger": "イベントポイント",
			"func": ((text) => {
				return ["資源", "イベントポイント", "＊",];
			}),
		},
		
		{
			"trigger": "カスタム",
			"func": ((text) => {
				return ["カスタム", "＊", "＊",];
			}),
		},
		{
			"trigger": "のアリーナを",
			"func": ((text) => {
				const mode = text.match(/(?<=L\d\s).*?(?=\sのアリーナ)/)[0];
				return ["アリーナ", `${mode}アリーナ`, "＊",];
			}),
		},

		{
			"trigger": "NG のゲームをフラグなし",
			"func": ((text) => {
				const mode = text.match(/(?<=レベル\s).*?(?=\sNG)/)[0];
				return ["NG", mode, "フラグなし",];
			}),
		},
		{
			"trigger": "NG のゲームを \\d+回クリア",
			"func": ((text) => {
				const mode = text.match(/(?<=レベル\s).*?(?=\sNG)/)[0];
				return ["NG", mode, "＊",];
			}),
		},
		
		{
			"trigger": " のゲームを効率",
			"func": ((text) => {
				const mode = text.match(/(?<=レベル\s).*?(?=\sのゲーム)/)[0];
				return ["効率", mode, "＊",];
			}),
		},
		{
			"trigger": " のゲームを \\d+ 秒以内",
			"func": ((text) => {
				const mode = text.match(/(?<=レベル\s).*?(?=\sのゲーム)/)[0];
				return ["速度", mode, "＊",];
			}),
		},
		{
			"trigger": " のゲームを100回中",
			"func": ((text) => {
				const mode = text.match(/(?<=レベル\s).*?(?=\sのゲーム)/)[0];
				return ["習熟", mode, "＊",];
			}),
		},
		{
			"trigger": " のゲームをフラグなし",
			"func": ((text) => {
				const mode = text.match(/(?<=レベル\s).*?(?=\sのゲーム)/)[0];
				return ["フラグなし", mode, "＊",];
			}),
		},
		
		{
			"trigger": " のゲームを \\d+\\s?回連続",
			"func": ((text) => {
				const mode = text.match(/(?<=レベル\s).*?(?=\sのゲーム)/)[0];
				return ["連勝", mode, "＊",];
			}),
		},
		{
			"trigger": " のゲームを \\d+回クリア",
			"func": ((text) => {
				const mode = text.match(/(?<=レベル\s).*?(?=\sのゲーム)/)[0];
				return ["回数", mode, "＊",];
			}),
		},
		
	]


	const ra = texts.map((text) => {
		const mat = MOD_DATAS.find((data) => {
			const reg = new RegExp(data["trigger"]);
			return text[1].match(data["trigger"]);
		});
		return mat ? mat["func"](text[1]) : [];
	});
	return ra;
}

function abstractDetail(texts){
	const DELETE_TEXTS = [
		" ",
		"レベル",
		"サイズ",
		"NG",
		"で",
		"のカスタムを",
		"のゲームを",
		"クリアする",
		"を稼ぐ",
		"以上",
		"ゲームの報酬",
		"を集める",
	];
	const Delete_reg = new RegExp(DELETE_TEXTS.join("|"), "g");
	const ra = texts.map((text) => {
		text[1] = text[1].replace(Delete_reg, "");
		const mat = text[1].match(/^\d+/);
		if(mat){
			const temp = mat[0];
			text[1] = text[1].replace(mat[0], "");
			text[1] += `${temp}個`;
		}
		return text;
	});
	return ra;
}

