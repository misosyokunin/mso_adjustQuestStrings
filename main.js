
{
	const p = document.createElement("p");
	p.textContent = "最終更新：";
	document.querySelector("body > footer").append(p);
	const span = document.createElement("span");
	span.textContent = document.lastModified;
	p.append(span);
}

const SAMPLE_TEXT = `
L10E	レベル 中級 のゲームを 8 回連続でクリアする	0 / 8	+18120⭐
+43.5⚡
L12	レベル 中級 のゲームを 20回クリアする	0 / 20	+725🟡
+17.4⚡
L12	レベル ハード NG のゲームをフラグなしで 5 回クリアする	0 / 5	+3.62🔴️
+17.4⚡
L10	イベントポイントを25個集める (イースターエッグ)	0 / 25	+3020⭐
+1.51🔴️
+14.5⚡
L11	レベル 上級 のゲームを 3回クリアする	0 / 3	+332🟡
+1.66🔴️
+16.0⚡
L11	レベル エビル NG のゲームを 5回クリアする	0 / 5	+3322⭐
+332🟡
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
	"headers": null,
	"fieldsets": null,
	"modifyFunction": function(texts){
		texts = abstractDetail(texts);
		return texts.map((text) => text.join("\t")).join("\n");
	},
});

makeArticle({
	"articleID": "changerAddQuestKind",
	"articleTitle": "クエストの分類をつける",
	"headers": null,
	"fieldsets": null,
	"modifyFunction": function(texts){
		const kinds = getKinds(texts);
		const ra = texts.map((text, index) => {
			return text.concat(kinds[index]).join("\t");
		});
		return ra.join("\n");
	},
});

makeArticle({
	"articleID": "changerEliteLevel",
	"articleTitle": "エリートを実質レベルへ換算する",
	"headers": null,
	"fieldsets": null,
	"modifyFunction": function(texts){
		const ra = texts.map((text, index) => {
			const mat = text[0].match(/\d+(?=E)/);
			if(mat){
				text[0] = text[0].replace(mat[0], Number(mat[0]) * 3).slice(0, -1);
			}
			return text.join("\t");
		});
		return ra.join("\n");
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
		const ta = str.split(/(?<=^\d+E?)\s|\t/);
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
			"trigger": "アリーナチケット",
			"func": ((text) => {
				return ["アリーナ", "アリーナチケット", "＊",];
			}),
		},
		{
			"trigger": "アリーナ",
			"func": ((text) => {
				const mode = text.match(/(?<=L\d\s?).*?(?=\s?の?アリーナ)/)[0];
				return ["アリーナ", `${mode}アリーナ`, "＊",];
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
			"trigger": "アクアマリン|オニキス|ルビー|トパーズ|サファイア|ダイヤモンド|エメラルド|アメジスト|ガーネット|翡翠",
			"func": ((text) => {
				const gem = text.match(/アクアマリン|オニキス|ルビー|トパーズ|サファイア|ダイヤモンド|エメラルド|アメジスト|ガーネット|翡翠/)[0];
				return ["資源", "宝石", gem];
			}),
		},
		
		{
			"trigger": "\\d+x\\d+/\\d+",
			"func": ((text) => {
				return ["カスタム", "＊", "＊",];
			}),
		},

		{
			"trigger": "イージー|ミディアム|ハード|エビル.+ヒントなし",
			"func": ((text) => {
				const mode = text.match(/イージー|ミディアム|ハード|エビル/)[0];
				return ["NG", mode, "ヒントなし",];
			}),
		},
		{
			"trigger": "イージー|ミディアム|ハード|エビル.+フラグなし",
			"func": ((text) => {
				const mode = text.match(/イージー|ミディアム|ハード|エビル/)[0];
				return ["NG", mode, "フラグなし",];
			}),
		},
		{
			"trigger": "イージー|ミディアム|ハード|エビル",
			"func": ((text) => {
				const mode = text.match(/イージー|ミディアム|ハード|エビル/)[0];
				return ["NG", mode, "＊",];
			}),
		},
		
		{
			"trigger": "効率",
			"func": ((text) => {
				const mode = text.match(/初級|中級|上級/)[0];
				return ["効率", mode, "＊",];
			}),
		},
		{
			"trigger": "秒以内",
			"func": ((text) => {
				const mode = text.match(/初級|中級|上級/)[0];
				return ["速度", mode, "＊",];
			}),
		},
		{
			"trigger": "100回中",
			"func": ((text) => {
				const mode = text.match(/初級|中級|上級/)[0];
				return ["習熟", mode, "＊",];
			}),
		},
		{
			"trigger": "フラグなし",
			"func": ((text) => {
				const mode = text.match(/初級|中級|上級/)[0];
				return ["フラグなし", mode, "＊",];
			}),
		},
		
		{
			"trigger": "連続",
			"func": ((text) => {
				const mode = text.match(/初級|中級|上級/)[0];
				return ["連勝", mode, "＊",];
			}),
		},
		{
			"trigger": "回",
			"func": ((text) => {
				const mode = text.match(/初級|中級|上級/)[0];
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
		"集める",
		"\\(.+\\)",
		"を稼ぐ",
		"以上",
		"ゲームの報酬",
		"を集める",
		"を見つける",
		"に",
		"の",
		"を",
	];
	const Delete_reg = new RegExp(DELETE_TEXTS.join("|"), "g");
	const ra = texts.map((text) => {
		text[1] = text[1].replace(Delete_reg, "");
		return text;
	});
	return ra;
}

