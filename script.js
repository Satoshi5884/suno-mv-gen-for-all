// プロンプトテンプレートのデータ
let promptTemplates = {};

// 選択されたアイテムを管理するオブジェクト
let selectedItems = {
    'song-style': [],
    'lyrics-mood': [],
    'vocal-features': []
};

// data.jsのcompleteEmbeddedDataを参照

// プロンプトテンプレートを読み込む
async function loadPromptTemplates() {
    try {
        console.log('Loading templates from embedded data...');
        
        // data.jsからデータを使用
        const songStyles = completeEmbeddedData.songStyles;
        const lyricsMoods = completeEmbeddedData.lyricsMoods;
        const vocalFeatures = completeEmbeddedData.vocalFeatures;
        const personas = completeEmbeddedData.personas || {};
        
        console.log('JSON files loaded successfully:', {
            songStyles: Object.keys(songStyles).length,
            lyricsMoods: Object.keys(lyricsMoods).length,
            vocalFeatures: Object.keys(vocalFeatures).length,
            personas: Object.keys(personas).length
        });
        
        // オブジェクトのキーを配列として格納（ランダム選択用）
        promptTemplates = {
            songStyles: Object.keys(songStyles),
            lyricsMoods: Object.keys(lyricsMoods),
            vocalFeatures: Object.keys(vocalFeatures),
            personas: Object.keys(personas)
        };
        
        // 詳細情報も保存
        promptTemplates.songStylesData = songStyles;
        promptTemplates.lyricsMoodsData = lyricsMoods;
        promptTemplates.vocalFeaturesData = vocalFeatures;
        promptTemplates.personasData = personas;
        
        console.log('Templates loaded and processed successfully');
        
        // デバッグ: 読み込まれたテンプレートをコンソールに表示
        console.log('Available song styles:', Object.keys(songStyles));
        console.log('Available lyrics moods:', Object.keys(lyricsMoods));
        console.log('Available vocal features:', Object.keys(vocalFeatures));
        
        // ローディング表示を非表示にする
        const loadingIndicator = document.getElementById('loading-indicator');
        if (loadingIndicator) {
            loadingIndicator.classList.add('hidden');
        }
        
    } catch (error) {
        console.error('プロンプトテンプレートの読み込みに失敗:', error);
        console.log('Using fallback from completeEmbeddedData...');
        
        // フォールバック時もdata.jsからデータを使用
        const songStyles = completeEmbeddedData.songStyles;
        const lyricsMoods = completeEmbeddedData.lyricsMoods;
        const vocalFeatures = completeEmbeddedData.vocalFeatures;
        const personas = completeEmbeddedData.personas || {};
        
        // オブジェクトのキーを配列として格納（ランダム選択用）
        promptTemplates = {
            songStyles: Object.keys(songStyles),
            lyricsMoods: Object.keys(lyricsMoods),
            vocalFeatures: Object.keys(vocalFeatures),
            personas: Object.keys(personas)
        };
        
        // 詳細情報も保存
        promptTemplates.songStylesData = songStyles;
        promptTemplates.lyricsMoodsData = lyricsMoods;
        promptTemplates.vocalFeaturesData = vocalFeatures;
        promptTemplates.personasData = personas;
        
        // フォールバック時もローディング表示を非表示にする
        const loadingIndicator = document.getElementById('loading-indicator');
        if (loadingIndicator) {
            loadingIndicator.classList.add('hidden');
        }
    }
}

// ランダムテンプレートを入力フィールドに設定
function fillRandomTemplate(inputId, templateKey) {
    if (!promptTemplates[templateKey] || promptTemplates[templateKey].length === 0) {
        console.error('テンプレートが見つかりません:', templateKey);
        return;
    }
    
    const templates = promptTemplates[templateKey];
    const randomIndex = Math.floor(Math.random() * templates.length);
    const randomTemplate = templates[randomIndex];
    
    const inputElement = document.getElementById(inputId);
    if (inputElement) {
        inputElement.value = randomTemplate;
        
        // 入力値変更のスタイル適用
        inputElement.style.borderColor = '#27ae60';
        
        // アニメーション効果
        inputElement.style.transform = 'scale(1.05)';
        setTimeout(() => {
            inputElement.style.transform = 'scale(1)';
        }, 200);
        
        // 詳細情報を横に表示（データが利用可能な場合）
        const dataKey = templateKey + 'Data';
        if (promptTemplates[dataKey] && promptTemplates[dataKey][randomTemplate]) {
            const details = promptTemplates[dataKey][randomTemplate];
            showTemplateDetail(inputId, details);
        }
        
        // テンプレート情報を更新
        updateTemplateInfo();
    }
}

// マルチセレクション用：ランダムテンプレートを選択に追加
function addRandomTemplate(inputId, templateKey) {
    if (!promptTemplates[templateKey] || promptTemplates[templateKey].length === 0) {
        console.error('テンプレートが見つかりません:', templateKey);
        return;
    }
    
    // 既に3つ選択されている場合は追加しない
    if (selectedItems[inputId] && selectedItems[inputId].length >= 3) {
        alert('最大3つまでしか選択できません。');
        return;
    }
    
    const templates = promptTemplates[templateKey];
    const availableTemplates = templates.filter(template => 
        !selectedItems[inputId] || !selectedItems[inputId].includes(template)
    );
    
    if (availableTemplates.length === 0) {
        alert('すべてのテンプレートが既に選択されています。');
        return;
    }
    
    const randomIndex = Math.floor(Math.random() * availableTemplates.length);
    const randomTemplate = availableTemplates[randomIndex];
    
    addSelectedItem(inputId, randomTemplate);
}

// 選択されたアイテムを追加
function addSelectedItem(inputId, itemName) {
    if (!selectedItems[inputId]) {
        selectedItems[inputId] = [];
    }
    
    // 重複確認
    if (selectedItems[inputId].includes(itemName)) {
        return;
    }
    
    // 3つまでの制限
    if (selectedItems[inputId].length >= 3) {
        alert('最大3つまでしか選択できません。');
        return;
    }
    
    selectedItems[inputId].push(itemName);
    updateSelectedDisplay(inputId);
    updateCombinationDisplay(inputId);
    updateTemplateInfo();
    
    // 詳細情報を表示
    const templateKeyMap = {
        'song-style': 'songStylesData',
        'lyrics-mood': 'lyricsMoodsData',
        'vocal-features': 'vocalFeaturesData'
    };
    
    const templateKey = templateKeyMap[inputId];
    if (templateKey && promptTemplates[templateKey] && promptTemplates[templateKey][itemName]) {
        const details = promptTemplates[templateKey][itemName];
        showTemplateDetail(inputId, details);
    }
}

// 選択されたアイテムの表示を更新
function updateSelectedDisplay(inputId) {
    const tagsContainer = document.getElementById(inputId + '-tags');
    if (!tagsContainer) return;
    
    const items = selectedItems[inputId] || [];
    
    if (items.length > 0) {
        tagsContainer.classList.add('has-items');
        tagsContainer.innerHTML = items.map(item => `
            <div class="selected-tag">
                ${item}
                <button class="remove-tag" onclick="removeSelectedItem('${inputId}', '${item}')">×</button>
            </div>
        `).join('');
    } else {
        tagsContainer.classList.remove('has-items');
        tagsContainer.innerHTML = '';
    }
}

// 組み合わせ表示の更新
function updateCombinationDisplay(inputId) {
    const combinationId = inputId + '-combination';
    let combinationDisplay = document.getElementById(combinationId);
    
    if (!combinationDisplay) {
        // 組み合わせ表示要素を作成
        const inputContainer = document.querySelector(`#${inputId}`).closest('.input-container');
        combinationDisplay = document.createElement('div');
        combinationDisplay.id = combinationId;
        combinationDisplay.className = 'combination-display';
        inputContainer.appendChild(combinationDisplay);
    }
    
    const items = selectedItems[inputId] || [];
    
    if (items.length > 1) {
        const combinationText = items.join(' <span class="combination-symbol">×</span> ');
        combinationDisplay.innerHTML = combinationText;
        combinationDisplay.classList.add('active');
    } else {
        combinationDisplay.classList.remove('active');
    }
}

// 選択されたアイテムを削除
function removeSelectedItem(inputId, itemName) {
    if (!selectedItems[inputId]) return;
    
    const index = selectedItems[inputId].indexOf(itemName);
    if (index > -1) {
        selectedItems[inputId].splice(index, 1);
        updateSelectedDisplay(inputId);
        updateCombinationDisplay(inputId);
        updateTemplateInfo();
    }
}

// すべての選択をクリア
function clearAllSelections(inputId) {
    selectedItems[inputId] = [];
    updateSelectedDisplay(inputId);
    updateCombinationDisplay(inputId);
    updateTemplateInfo();
    
    // 詳細情報も非表示にする
    const detailElement = document.getElementById(inputId + '-detail');
    if (detailElement) {
        detailElement.classList.remove('active');
    }
}

// 出力エリアをクリア
function clearOutput(outputId) {
    const outputElement = document.getElementById(outputId);
    if (outputElement) {
        outputElement.value = '';
        
        // 視覚的フィードバック
        outputElement.style.borderColor = '#e1e8ed';
        outputElement.style.background = '#f8f9fa';
        
        setTimeout(() => {
            outputElement.style.background = '';
        }, 500);
    }
}

// テキストエリアをクリア
function clearTextarea(textareaId) {
    const textarea = document.getElementById(textareaId);
    if (textarea) {
        textarea.value = '';
        
        // 視覚的フィードバック
        textarea.style.borderColor = '#e1e8ed';
        textarea.style.transform = 'scale(0.98)';
        
        setTimeout(() => {
            textarea.style.transform = 'scale(1)';
        }, 200);
    }
}

// 入力フィールドをクリア
function clearInput(inputId) {
    const input = document.getElementById(inputId);
    if (input) {
        input.value = '';
        
        // 視覚的フィードバック
        input.style.borderColor = '#e1e8ed';
        input.style.transform = 'scale(0.98)';
        
        setTimeout(() => {
            input.style.transform = 'scale(1)';
        }, 200);
    }
}

// テンプレート選択モーダルを表示
function showTemplateSelector(inputId, templateKey) {
    const modal = document.getElementById('template-selector-modal');
    const modalTitle = document.getElementById('modal-title');
    const templateList = document.getElementById('template-list');
    
    // タイトルを設定
    const titleMap = {
        'song-style': '曲のスタイルを選択',
        'lyrics-mood': '歌詞の雰囲気を選択',
        'vocal-features': '声の特徴を選択',
        'persona': '人物像を選択'
    };
    modalTitle.textContent = titleMap[inputId] || 'テンプレートを選択';
    
    // テンプレートリストを生成
    const dataKey = templateKey + 'Data';
    const templates = promptTemplates[dataKey];
    
    if (templates) {
        templateList.innerHTML = '';
        
        Object.keys(templates).forEach(templateName => {
            const template = templates[templateName];
            const isSelected = inputId !== 'persona' && selectedItems[inputId] && selectedItems[inputId].includes(templateName);
            
            const templateItem = document.createElement('div');
            templateItem.className = `template-item ${isSelected ? 'selected' : ''}`;
            templateItem.innerHTML = `
                <h4>${template.name_jp} <span class="english-name">(${template.name_en})</span></h4>
                <div class="description">${template.description}</div>
                <div class="keywords">${template.keywords.map(k => `<span class="keyword-tag">${k}</span>`).join('')}</div>
            `;
            
            templateItem.addEventListener('click', function() {
                if (inputId === 'persona') {
                    // ペルソナは単一選択・テキスト入力
                    const input = document.getElementById('persona');
                    if (input) {
                        input.value = templateName;
                        showTemplateDetail('persona', template);
                        updateTemplateInfo();
                    }
                    closeTemplateSelector();
                } else {
                    // 既に選択されている場合は削除、そうでなければ追加
                    if (isSelected) {
                        removeSelectedItem(inputId, templateName);
                    } else {
                        addSelectedItem(inputId, templateName);
                    }
                    // モーダルを閉じる
                    closeTemplateSelector();
                }
            });
            
            templateList.appendChild(templateItem);
        });
    }
    
    // モーダルを表示
    modal.style.display = 'block';
    
    // ESCキーでモーダルを閉じる
    document.addEventListener('keydown', handleModalEscape);
    
    // モーダル外クリックで閉じる
    modal.addEventListener('click', handleModalOutsideClick);
}

// テンプレート選択モーダルを閉じる
function closeTemplateSelector() {
    const modal = document.getElementById('template-selector-modal');
    modal.style.display = 'none';
    
    // イベントリスナーを削除
    document.removeEventListener('keydown', handleModalEscape);
    modal.removeEventListener('click', handleModalOutsideClick);
}

// ESCキーでモーダルを閉じる
function handleModalEscape(e) {
    if (e.key === 'Escape') {
        closeTemplateSelector();
    }
}

// モーダル外クリックで閉じる
function handleModalOutsideClick(e) {
    const modal = document.getElementById('template-selector-modal');
    if (e.target === modal) {
        closeTemplateSelector();
    }
}

// テンプレート詳細情報を表示
function showTemplateDetail(inputId, details) {
    const detailId = inputId + '-detail';
    const detailElement = document.getElementById(detailId);
    
    if (detailElement) {
        // 表示専用のヒント（編集不可）
        const keywordsHtml = (details.keywords || []).map(keyword => 
            `<span class="keyword-tag">${keyword}</span>`
        ).join('');

        detailElement.innerHTML = `
            <h4>${details.name_jp} <span class="english-name">(${details.name_en})</span></h4>
            <div class="description">${details.description || ''}</div>
            <div class="keywords">${keywordsHtml}</div>
        `;

        // アクティブクラスを追加してアニメーション表示
        detailElement.classList.add('active');
        
        // 既に表示されている他の詳細情報を非表示にする
        document.querySelectorAll('.template-detail').forEach(element => {
            if (element.id !== detailId) {
                element.classList.remove('active');
            }
        });
    }
}

// テンプレート情報を表示
function updateTemplateInfo() {
    const templateInfo = document.getElementById('template-info-step1');
    if (templateInfo) {
        let infoText = '';
        const usedTemplates = [];
        
        // マルチセレクション対応
        const songStyles = selectedItems['song-style'] && selectedItems['song-style'].length > 0 
            ? selectedItems['song-style'] 
            : [document.getElementById('song-style').value.trim()].filter(v => v);
        
        const lyricsMoods = selectedItems['lyrics-mood'] && selectedItems['lyrics-mood'].length > 0 
            ? selectedItems['lyrics-mood'] 
            : [document.getElementById('lyrics-mood').value.trim()].filter(v => v);
        
        const vocalFeatures = selectedItems['vocal-features'] && selectedItems['vocal-features'].length > 0 
            ? selectedItems['vocal-features'] 
            : [document.getElementById('vocal-features').value.trim()].filter(v => v);
        
        if (songStyles.length > 0 || lyricsMoods.length > 0 || vocalFeatures.length > 0) {
            infoText = 'テンプレート使用: ';
            
            if (songStyles.length > 0) {
                const validStyles = songStyles.filter(style => 
                    promptTemplates.songStyles && promptTemplates.songStyles.includes(style)
                );
                if (validStyles.length > 0) {
                    usedTemplates.push(`曲スタイル(${validStyles.length})`);
                }
            }
            
            if (lyricsMoods.length > 0) {
                const validMoods = lyricsMoods.filter(mood => 
                    promptTemplates.lyricsMoods && promptTemplates.lyricsMoods.includes(mood)
                );
                if (validMoods.length > 0) {
                    usedTemplates.push(`歌詞雰囲気(${validMoods.length})`);
                }
            }
            
            if (vocalFeatures.length > 0) {
                const validFeatures = vocalFeatures.filter(feature => 
                    promptTemplates.vocalFeatures && promptTemplates.vocalFeatures.includes(feature)
                );
                if (validFeatures.length > 0) {
                    usedTemplates.push(`声の特徴(${validFeatures.length})`);
                }
            }
            
            infoText += usedTemplates.join('、');
        }
        templateInfo.textContent = infoText;
    }
}

// 表示専用化に伴い、カスタム説明/キーワードの編集・反映機能は撤去

// ステップ1: ChatGPT-5での曲作成プロンプト生成
function generateStep1Prompt() {
    // マルチセレクションの場合は選択されたアイテムを使用
    const songStyles = selectedItems['song-style'] && selectedItems['song-style'].length > 0 
        ? selectedItems['song-style'] 
        : [document.getElementById('song-style').value.trim()].filter(v => v);
    
    const lyricsMoods = selectedItems['lyrics-mood'] && selectedItems['lyrics-mood'].length > 0 
        ? selectedItems['lyrics-mood'] 
        : [document.getElementById('lyrics-mood').value.trim()].filter(v => v);
    
    const vocalFeatures = selectedItems['vocal-features'] && selectedItems['vocal-features'].length > 0 
        ? selectedItems['vocal-features'] 
        : [document.getElementById('vocal-features').value.trim()].filter(v => v);
    
    // テキストボックスの内容も取得
    const songStyleText = document.getElementById('song-style').value.trim();
    const lyricsMoodText = document.getElementById('lyrics-mood').value.trim();
    const vocalFeaturesText = document.getElementById('vocal-features').value.trim();
    const personaText = (document.getElementById('persona')?.value || '').trim();
    const personaGender = (document.querySelector('input[name="persona-gender"]:checked')?.value) || 'unset';
    const vocalCount = (document.querySelector('input[name="vocal-count"]:checked')?.value) || 'unset';
    const vocalGender = (document.querySelector('input[name="vocal-gender"]:checked')?.value) || 'unset';
    
    if (songStyles.length === 0 || lyricsMoods.length === 0 || vocalFeatures.length === 0) {
        alert('すべての項目を選択または入力してください。');
        return;
    }
    
    let prompt = `suno用の完璧な歌詞とプロンプト、タイトルを考えてください。`;

    // 画面上の詳細見出しは出さず、最終まとめ文のみ生成
    
    // 追加指定の内容を構築
    let additionalSpecs = '';
    const personaExtra = (document.getElementById('persona-extra')?.value || '').trim();
    if (songStyleText && !songStyles.some(style => songStyleText.includes(style))) {
        additionalSpecs += `音楽スタイル追加指定: ${songStyleText}、`;
    }
    if (lyricsMoodText && !lyricsMoods.some(mood => lyricsMoodText.includes(mood))) {
        additionalSpecs += `歌詞雰囲気追加指定: ${lyricsMoodText}、`;
    }
    if (vocalFeaturesText && !vocalFeatures.some(feature => vocalFeaturesText.includes(feature))) {
        additionalSpecs += `ボーカル特徴追加指定: ${vocalFeaturesText}、`;
    }
    if (personaExtra) {
        additionalSpecs += `人物像追加指定: ${personaExtra}、`;
    }
    // 末尾のカンマを削除
    additionalSpecs = additionalSpecs.replace(/、$/, '');
    
    // まとめ文生成
    const vocalCountJp = vocalCount === 'one' ? '1人' : (vocalCount === 'two' ? '2人' : (vocalCount === 'multiple' ? '複数' : ''));
    const vocalGenderJp = vocalGender === 'male' ? '男性' : (vocalGender === 'female' ? '女性' : '');
    const personaGenderJp = personaGender === 'male' ? '男性' : (personaGender === 'female' ? '女性' : '');
    const personaPhrase = personaText
        ? `${personaGenderJp ? personaGenderJp : ''}${personaText}`
        : (personaGenderJp ? `${personaGenderJp}j-popアイドルグループ` : 'j-popアイドルグループ');

    const baseLine = `「${songStyles.join('×')}」の${personaPhrase}の楽曲で、歌詞は「${lyricsMoods.join('×')}」をベースにしてください。`;
    const vocalModifiers = [];
    if (vocalCountJp) vocalModifiers.push(vocalCountJp);
    if (vocalGenderJp) vocalModifiers.push(vocalGenderJp);
    const vocalSpec = vocalModifiers.length > 0
        ? `ボーカルは「${vocalFeatures.join('×')}」の${vocalModifiers.join('の')}ボーカルでお願いします。`
        : `ボーカルは「${vocalFeatures.join('×')}」でお願いします。`;

    prompt += `\n\n${baseLine}${vocalSpec}${additionalSpecs ? `追加で以下の指定も反映してください: ${additionalSpecs}。` : ''}歌詞とプロンプト、タイトルそれぞれをコードブロックにしてコピーしやすいようにして下さい

# 制約条件  
- タイトルは平仮名に限らず出力してください。
- 歌詞に制限はないですが、プロンプトは英語で1000字以内にしてください。         
- 歌詞はすべてひらがなで出力してください。          
- 助詞の「は」は「wa」、「へ」は「e」と表記してください。            
- 必ず最後に[作った歌詞の簡単な解説]を付け加えてください。`;
    
    document.getElementById('step1-output').value = prompt;
    
    // テンプレート情報を更新
    updateTemplateInfo();
    
    // アニメーション効果
    animateOutput('step1-output');
}

// ステップ3: Google AI Studioでの歌詞区切りプロンプト生成
function generateStep3Prompt() {
    const minutes = document.getElementById('song-duration-minutes').value.trim();
    const seconds = document.getElementById('song-duration-seconds').value.trim();
    const interval = document.getElementById('segment-interval-seconds')?.value.trim() || '8';
    
    if (!minutes && !seconds) {
        alert('曲の長さを入力してください。');
        return;
    }
    
    const totalMinutes = parseInt(minutes || 0);
    const totalSeconds = parseInt(seconds || 0);
    const totalDurationInSeconds = totalMinutes * 60 + totalSeconds;
    
    if (totalDurationInSeconds <= 0) {
        alert('正しい曲の長さを入力してください。');
        return;
    }
    
    let durationText = '';
    if (totalMinutes > 0 && totalSeconds > 0) {
        durationText = `${totalMinutes}分${totalSeconds}秒`;
    } else if (totalMinutes > 0) {
        durationText = `${totalMinutes}分`;
    } else {
        durationText = `${totalSeconds}秒`;
    }
    
    const intSec = Math.max(1, Math.min(60, parseInt(interval || '8', 10)));
    const prompt = `この音声を${intSec}秒毎に区切って歌詞を出力してください。秒数を入れてコピペしやすいようにコードブロックにして下さい。${durationText}（合計${totalDurationInSeconds}秒）の歌なので、全て${intSec}秒区切りで文字起こししてください`;
    
    document.getElementById('step3-output').value = prompt;
    
    // 曲の長さをステップ4でも使用できるように保存
    localStorage.setItem('songDurationText', durationText);
    localStorage.setItem('songDurationSeconds', totalDurationInSeconds.toString());
    localStorage.setItem('segmentIntervalSeconds', String(intSec));
    
    // アニメーション効果  
    animateOutput('step3-output');
}

// ステップ4: ChatGPT-5でのVeo3用プロンプト生成
function generateStep4Prompt() {
    const originalLyrics = document.getElementById('original-lyrics').value.trim();
    const segmentedLyrics = document.getElementById('segmented-lyrics').value.trim();
    const songBpm = document.getElementById('song-bpm').value.trim();
    
    // 保存された曲の長さを取得
    const songDurationText = localStorage.getItem('songDurationText') || '';
    const songDurationSeconds = localStorage.getItem('songDurationSeconds') || '';
    const segmentIntervalSeconds = localStorage.getItem('segmentIntervalSeconds') || '8';
    
    if (!originalLyrics || !segmentedLyrics) {
        alert('元の歌詞と8秒ごとに区切った歌詞を入力してください。');
        return;
    }
    

    
    if (!songDurationText) {
        alert('先にステップ3で曲の長さを設定してください。');
        return;
    }
    
    // BPMの表示を条件分岐
    const bpmText = songBpm && songBpm > 0 ? `プロンプトにはBPM${songBpm}も入れてください、` : '';
    
    const prompt = `${songDurationText}の歌です。veo3で動画を作りたいので、元々生成した歌詞を参考に、下記${segmentIntervalSeconds}秒ごとに区切って文字起こしした歌詞に沿って、動画のプロンプトを${segmentIntervalSeconds}秒ずつに分けて作ってください。${bpmText}また動画内に文字が入らないようにしてください。コピペしやすいようにコードブロックで分けて、プロンプト内に通し番号も付けて下さい。プロンプトはすべて英語にしてください。

## 元の歌詞:
${originalLyrics}

## 8秒ごとに区切った歌詞:
${segmentedLyrics}`;
    
    document.getElementById('step4-output').value = prompt;
    
    // アニメーション効果
    animateOutput('step4-output');
}

// クリップボードにコピーする機能
async function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    const text = element.value;
    
    if (!text.trim()) {
        alert('コピーするテキストがありません。');
        return;
    }
    
    try {
        await navigator.clipboard.writeText(text);
        
        // コピー成功の視覚的フィードバック
        const copyBtn = event.target;
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'コピー完了!';
        copyBtn.style.backgroundColor = '#27ae60';
        
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.backgroundColor = '#2ecc71';
        }, 2000);
        
    } catch (err) {
        // フォールバック: 古いブラウザ対応
        element.select();
        document.execCommand('copy');
        
        alert('テキストがクリップボードにコピーされました！');
    }
}

// 出力エリアのアニメーション効果
function animateOutput(elementId) {
    const element = document.getElementById(elementId);
    element.style.opacity = '0';
    element.style.transform = 'translateY(10px)';
    
    setTimeout(() => {
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
    }, 100);
}

// テキスト入力でアイテムを追加する機能
function handleTextInput(inputId) {
    const inputElement = document.getElementById(inputId);
    if (!inputElement) return;
    
    inputElement.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && this.value.trim()) {
            e.preventDefault();
            const itemName = this.value.trim();
            addSelectedItem(inputId, itemName);
            this.value = ''; // 入力をクリア
        }
    });
}

// 入力フィールドの値が変更された時の処理
function setupInputHandlers() {
    // 全ての入力フィールドにイベントリスナーを追加
    const allInputs = document.querySelectorAll('input, textarea');
    
    allInputs.forEach(input => {
        input.addEventListener('input', function() {
            // 入力値が変更されたときのスタイル調整
            if (this.value.trim()) {
                this.style.borderColor = '#27ae60';
            } else {
                this.style.borderColor = '#e1e8ed';
            }
            
            // テンプレート情報を更新（ステップ1の入力フィールドの場合）
            if (['song-style', 'lyrics-mood', 'vocal-features', 'persona', 'persona-extra'].includes(this.id)) {
                updateTemplateInfo();
                
                // 手動入力時にも詳細情報を表示
                const templateKeyMap = {
                    'song-style': 'songStylesData',
                    'lyrics-mood': 'lyricsMoodsData',
                    'vocal-features': 'vocalFeaturesData',
                    'persona': 'personasData'
                };
                
                const templateKey = templateKeyMap[this.id];
                // 今回は説明・キーワードをプロンプトに入れない方針だが、UIの詳細表示は維持
                if (templateKey && promptTemplates[templateKey] && promptTemplates[templateKey][this.value.trim()]) {
                    const details = promptTemplates[templateKey][this.value.trim()];
                    showTemplateDetail(this.id, details);
                } else {
                    const detailElement = document.getElementById(this.id + '-detail');
                    if (detailElement) {
                        detailElement.classList.remove('active');
                    }
                }
            }
        });
        
        // フォーカス時のスタイル
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
            this.parentElement.style.transition = 'transform 0.2s ease';
        });
        
        // フォーカスアウト時のスタイル
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
    });
}

// ステップ間のデータ連携
function syncStepData() {
    // ステップ1で入力された曲の長さをステップ4にも反映
    const step1Duration = document.getElementById('song-duration');
    if (step1Duration) {
        step1Duration.addEventListener('change', function() {
            // 他のステップでも同じ値を使用できるようにローカルストレージに保存
            localStorage.setItem('songDuration', this.value);
        });
    }

    // 区切り秒数の保存
    const segmentIntervalInput = document.getElementById('segment-interval-seconds');
    if (segmentIntervalInput) {
        segmentIntervalInput.addEventListener('change', function() {
            const intSec = Math.max(1, Math.min(60, parseInt(this.value || '8', 10)));
            this.value = String(intSec);
            localStorage.setItem('segmentIntervalSeconds', String(intSec));
        });
        // 再読込時に復元
        const saved = localStorage.getItem('segmentIntervalSeconds');
        if (saved) {
            segmentIntervalInput.value = saved;
        }
    }
}

// ページ読み込み時の初期化
document.addEventListener('DOMContentLoaded', function() {
    // プロンプトテンプレートを読み込み
    loadPromptTemplates();
    
    setupInputHandlers();
    syncStepData();
    
    // マルチセレクション用のテキスト入力ハンドラを設定
    handleTextInput('song-style');
    handleTextInput('lyrics-mood');
    handleTextInput('vocal-features');
    
    // ローカルストレージから値を復元
    const savedDuration = localStorage.getItem('songDuration');
    if (savedDuration) {
        const durationInput = document.getElementById('song-duration');
        if (durationInput) {
            durationInput.value = savedDuration;
        }
    }
    
    // スムーズスクロールの設定
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // キーボードショートカット
    document.addEventListener('keydown', function(e) {
        // Ctrl+Enter でアクティブなステップのプロンプト生成
        if (e.ctrlKey && e.key === 'Enter') {
            const activeElement = document.activeElement;
            const step = activeElement.closest('.step');
            if (step) {
                const generateBtn = step.querySelector('.generate-btn');
                if (generateBtn) {
                    generateBtn.click();
                }
            }
        }
    });

    // JSONエクスポート/インポートの設定
    const exportBtn = document.getElementById('export-settings-btn');
    const importBtn = document.getElementById('import-settings-btn');
    const importInput = document.getElementById('import-json-input');

    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            const data = collectCurrentSettingsAsJson();
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            const ts = new Date().toISOString().replace(/[:.]/g, '-');
            a.href = url;
            a.download = `suno-mv-gen-settings-${ts}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    }

    if (importBtn && importInput) {
        importBtn.addEventListener('click', function() {
            importInput.click();
        });
        importInput.addEventListener('change', async function(e) {
            const file = e.target.files && e.target.files[0];
            if (!file) return;
            try {
                const text = await file.text();
                const json = JSON.parse(text);
                applySettingsFromJson(json);
            } catch (err) {
                alert('JSONの読み込みに失敗しました');
                console.error(err);
            } finally {
                importInput.value = '';
            }
        });
    }
});

// エラーハンドリング
window.addEventListener('error', function(e) {
    console.error('アプリケーションエラー:', e.error);
});

// フォームデータの保存・復元機能
function saveFormData() {
    const formData = {};
    const inputs = document.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
        if (input.id) {
            formData[input.id] = input.value;
        }
    });
    
    // ラジオ選択も保存
    formData.personaGender = document.querySelector('input[name="persona-gender"]:checked')?.value || 'unset';
    formData.vocalCount = document.querySelector('input[name="vocal-count"]:checked')?.value || 'unset';
    formData.vocalGender = document.querySelector('input[name="vocal-gender"]:checked')?.value || 'unset';
    formData.personaExtra = document.getElementById('persona-extra')?.value || '';

    // マルチセレクションデータも保存
    formData.selectedItems = selectedItems;
    
    localStorage.setItem('sunoMvGenFormData', JSON.stringify(formData));
}

function loadFormData() {
    const savedData = localStorage.getItem('sunoMvGenFormData');
    if (savedData) {
        const formData = JSON.parse(savedData);
        
        Object.keys(formData).forEach(id => {
            if (id === 'selectedItems') {
                selectedItems = formData[id] || {
                    'song-style': [],
                    'lyrics-mood': [],
                    'vocal-features': []
                };
                // UI更新
                Object.keys(selectedItems).forEach(inputId => {
                    updateSelectedDisplay(inputId);
                    updateCombinationDisplay(inputId);
                });
            } else if (id === 'personaGender') {
                const radio = document.querySelector(`input[name="persona-gender"][value="${formData[id]}"]`);
                if (radio) radio.checked = true;
            } else if (id === 'vocalCount') {
                const radio = document.querySelector(`input[name="vocal-count"][value="${formData[id]}"]`);
                if (radio) radio.checked = true;
            } else if (id === 'vocalGender') {
                const radio = document.querySelector(`input[name="vocal-gender"][value="${formData[id]}"]`);
                if (radio) radio.checked = true;
            } else if (id === 'personaExtra') {
                const element = document.getElementById('persona-extra');
                if (element) element.value = formData[id];
            } else {
                const element = document.getElementById(id);
                if (element) {
                    element.value = formData[id];
                }
            }
        });
        
        // テンプレート情報を更新
        updateTemplateInfo();
    }
}

// 自動保存機能
setInterval(saveFormData, 30000); // 30秒ごとに自動保存

// ページ離脱時の保存
window.addEventListener('beforeunload', saveFormData);

// ページ読み込み時の復元  
window.addEventListener('load', loadFormData);

// 現在の設定をJSONとして収集
function collectCurrentSettingsAsJson() {
    const persona = (document.getElementById('persona')?.value || '').trim();
    const personaGender = document.querySelector('input[name="persona-gender"]:checked')?.value || 'unset';
    const vocalCount = document.querySelector('input[name="vocal-count"]:checked')?.value || 'unset';
    const vocalGender = document.querySelector('input[name="vocal-gender"]:checked')?.value || 'unset';
    const personaExtra = (document.getElementById('persona-extra')?.value || '').trim();

    return {
        persona,
        personaGender,
        vocalCount,
        vocalGender,
        personaExtra,
        selectedItems,
        inputs: {
            songStyleInput: document.getElementById('song-style')?.value || '',
            lyricsMoodInput: document.getElementById('lyrics-mood')?.value || '',
            vocalFeaturesInput: document.getElementById('vocal-features')?.value || ''
        }
    };
}

// JSONから設定を反映
function applySettingsFromJson(json) {
    try {
        // 基本テキスト
        if (json.inputs) {
            if (typeof json.inputs.songStyleInput === 'string') {
                const el = document.getElementById('song-style');
                if (el) el.value = json.inputs.songStyleInput;
            }
            if (typeof json.inputs.lyricsMoodInput === 'string') {
                const el = document.getElementById('lyrics-mood');
                if (el) el.value = json.inputs.lyricsMoodInput;
            }
            if (typeof json.inputs.vocalFeaturesInput === 'string') {
                const el = document.getElementById('vocal-features');
                if (el) el.value = json.inputs.vocalFeaturesInput;
            }
        }

        // 人物像
        if (typeof json.persona === 'string') {
            const el = document.getElementById('persona');
            if (el) el.value = json.persona;
        }
        if (typeof json.personaExtra === 'string') {
            const el = document.getElementById('persona-extra');
            if (el) el.value = json.personaExtra;
        }
        if (typeof json.personaGender === 'string') {
            const radio = document.querySelector(`input[name="persona-gender"][value="${json.personaGender}"]`);
            if (radio) radio.checked = true;
        }

        // ボーカル
        if (typeof json.vocalCount === 'string') {
            const radio = document.querySelector(`input[name="vocal-count"][value="${json.vocalCount}"]`);
            if (radio) radio.checked = true;
        }
        if (typeof json.vocalGender === 'string') {
            const radio = document.querySelector(`input[name="vocal-gender"][value="${json.vocalGender}"]`);
            if (radio) radio.checked = true;
        }

        // 選択済みテンプレート
        if (json.selectedItems && typeof json.selectedItems === 'object') {
            selectedItems = json.selectedItems;
            ['song-style','lyrics-mood','vocal-features'].forEach(id => {
                updateSelectedDisplay(id);
                updateCombinationDisplay(id);
            });
        }

        // （表示専用化のため）カスタム説明/キーワードは取り扱わない

        updateTemplateInfo();
        saveFormData();
        alert('設定をインポートしました');
    } catch (e) {
        console.error(e);
        alert('設定の反映に失敗しました');
    }
}