"use strict";

const {main, div, p, button, h1} = van.tags;

// GLOBAL STSATE VARIABLES

const PLAYER = {
  hp: van.state(0),
  points: van.state(0),
  gold: van.state(0),
  inventory: van.state([]),
  class: van.state(""),
  attackDamage: 0,
  hitChance: 0,
  skills: {
    fist: 0,
    stick: 0,
    sword: 0,
    knife: 0,
    bow: 0,
  },
}

const ENEMY = {
  hp: 0,
}


// GAME DATA

const ENEMIES = {
  wolf: {
    name: "ulven 🐺",
    hp: 6,
    attackDamage: 2,
    hitChance: 50,
    points: 2,
  },
  angryMan: {
    name: "den vrede mand 😡",
    hp: 10,
    attackDamage: 2,
    hitChance: 50,
    points: 3,
  },
  ninja: {
    name: "røveren 🥷",
    hp: 10,
    attackDamage: 4,
    hitChance: 40,
    points: 3,
  },
  gorilla: {
    name: "gorillaen 🦍",
    hp: 12,
    attackDamage: 3,
    hitChance: 30,
    points: 2,
  },
  guard: {
    name: "vagten 💂",
    hp: 15,
    attackDamage: 4,
    hitChance: 50,
    points: 4,
  },
}

const ITEMS = {
  fist: { img: "👊", weapon: true, type: "fist", damage: 1, hitChance: 90 },
  key11: { img: "🗝️", weapon: false },
  fishrod: { img: "🎣", weapon: true, type: "stick", damage: 2, hitChance: 70 },
  silverSword: { img: "🗡️", weapon: true, type: "sword", damage: 6, hitChance: 40 },
  knife: { img: "🔪", weapon: true, type: "knife", damage: 4, hitChance: 60 },
  bow: { img: "🏹", weapon: true, type: "bow", damage: 5, hitChance: 50 },
  staff: { img: "🦯", weapon: true, type: "stick", damage: 3, hitChance: 70 },
}

const SCENES = {
  intro: () => {
    PLAYER.hp.val = 0;
    PLAYER.points.val = 0;
    PLAYER.gold.val = 0;
    PLAYER.inventory.val = [];
    PLAYER.class.val = "";
    PLAYER.skills = { fist: 0, stick: 0, sword: 0, knife: 0, bow: 0};
    const text = "Velkommen til Måneby 🌙🏘️! Du er en eventyrer 🤠 der er rejst til Måneby. Du vågner op i et mærkeligt rum. Du må ud, og gerne få så mange point som muligt. God fornøjelse! 😀";
    const actions = [{label: "▶️ begynd", handler: () => goto("rollHp")}];
    return Scene({ text, actions });
  },
  rollHp: () => {
    const text = "Først skal du finde ud af hvor mange HP ❤️ du skal have. Slå med terningen 🎲. Læg 7 til resultatet og så mange HP har du.";
    const actions = [{label: "🎲 slå med terning", handler: () => goto("rollHpResult")}];
    return Scene({ text, actions });
  },
  rollHpResult: () => {
    const roll = rollDice(1)[0];
    PLAYER.hp.val = 7 + roll;
    const text = `Du slog ${roll} 🎲. Dit HP er nu ${PLAYER.hp.val}.`;
    const actions = [{label: "⬆️ fortsæt", handler: () => goto("chooseSkills")}];
    return Scene({ text, actions });
  },
  chooseSkills: () => {
    const text = "Undervejs i eventyret kan du få forskellige våben ⚔️. Der er fire slags våben: sværd 🗡️, bue 🏹, kniv 🔪 og pind 🪾. Jo flere point du har, jo bedre er du til at ramme med det våben. Hvilken type eventyrer du vil være?"
    const actions = [
      {label: "kriger (3🗡️ 1🔪)", handler: () => { PLAYER.class.val = "kriger (3🗡️ 1🔪)"; PLAYER.skills.sword = 3; PLAYER.skills.knife = 1; goto("scene1") }},
      {label: "skytte (3🏹 1🗡️)", handler: () => { PLAYER.class.val = "skytte (3🏹 1🗡️)"; PLAYER.skills.bow = 3; PLAYER.skills.sword = 1; goto("scene1") }},
      {label: "tyv (3🔪 1🪾)", handler: () => { PLAYER.class.val = "tyv (3🔪 1🪾)"; PLAYER.skills.knife = 3; PLAYER.skills.stick = 1; goto("scene1") }},
      {label: "hobbit (3🪾 1🏹)", handler: () => { PLAYER.class.val = "hobbit (3🪾 1🏹)"; PLAYER.skills.stick = 3; PLAYER.skills.bow = 1; goto("scene1") }}
    ];
    return Scene({ text, actions });
  },
  scene1: () => {
    const text = "Du står i et rum 🛖. Der er en kiste og en tønde. Du må kigge i højst 1 ting. Hvad vælger du?";
    const actions = [
      {label: "🧰 kiste", handler: () => { collectItem(ITEMS.key11); goto("scene1Kiste") }},
      {label: "🛢️ tønde", handler: () => { collectItem(ITEMS.fishrod); goto("scene1Tønde") }},
    ];
    return Scene({ text, actions });
  },
  scene1Kiste: () => {
    const text = "I kisten finder du en nøgle 🗝️ med nummer 11 på.";
    const actions = [{label: "⬆️ fortsæt", handler: () => goto("scene27")}];
    return Scene({ text, actions });
  },
  scene1Tønde: () => {
    const text = "I tønden finder du en fiskestang 🎣.";
    const actions = [{label: "⬆️ fortsæt", handler: () => goto("scene27")}];
    return Scene({ text, actions });
  },
  scene2: () => {
    const text = "Du er inde i den tætte skov 🌳. Du står ved en lille dam 💧. Hvilken vej tager du?";
    const actions = [
      {label: "⬅️ venstre", handler: () => goto("scene28")},
      {label: "➡️ højre", handler: () => goto("scene24")}
    ];
    return Scene({ text, actions });
  },
  scene3: () => {
    ENEMY.hp = ENEMIES.ninja.hp;
    const text = "På vejen møder du en røver 🥷. Han vil have alle dine ting! Han angriber dig. Vælg et angreb:";
    const actions = getAttacks("scene3Battle");
    return Scene({ text, actions });
  },
  scene3Battle: () => {
    return battle("scene3Battle", "scene11", "scene15", ENEMIES.ninja);
  },
  scene4: () => {
    PLAYER.hp.val += 4;
    const text = "Du sover på kroen 🏠. Du spiser et måltid 🥗 og får +4 HP ❤️. Bagefter går du videre.";
    const actions = [{label: "⬆️ fortsæt", handler: () => goto("scene23")}];
    return Scene({ text, actions });
  },
  scene5: () => {
    const text = "Du kommer til et kryds ❌ langs skoven 🌳. Der er en sti 🍂 ind i skoven og en større vej 🛣️. Hvilken tager du?";
    const actions = [
      {label: "🍂 stien", handler: () => goto("scene14")},
      {label: "🛣️ vejen", handler: () => goto("scene9")},
    ];
    return Scene({ text, actions });
  },
  scene6: () => {
    collectItem(ITEMS.knife);
    PLAYER.gold.val += 10;
    const text = "Du vinder over manden 🎖️. Du slår ham til jorden og han taber sine ting. Du tager hans kniv 🔪 og 10 guldmønter 🪙.";
    const actions = [{label: "⬆️ fortsæt", handler: () => goto("scene21")}];
    return Scene({ text, actions });
  },
  scene7: () => {
    let text = "Du går videre ud i byen. Der sidder en mand 👴 ved vejen, og du vælger at spørge ham: »Hvordan kommer jeg ud af byen?« Han svarer at for 1 guldmønt 🪙 kan han vise dig vej ud til den store port ⛩️.";
    let actions = [{label: "🏃 gå videre", handler: () => goto("scene3")}];
    if (PLAYER.gold.val < 1) {
      text += " Du har ikke penge nok ☹️. Du må gå videre.";
      return Scene({ text, actions });
    }
    text += " Vil du betale ham for at vise vej eller gå videre?";
    actions.unshift({label: "🪙 betal manden", handler: () => { PLAYER.gold.val -= 1; goto("scene25") }});
    return Scene({ text, actions });
  },
  scene8: () => {
    let text = "Du fortsætter og kommer til en lille kro 🏠. Et måltid 🥗 og overnatning 🛏️ koster 3 guld 🪙.";
    let actions = [
      {label: "🛏️ bliv på kroen", handler: () => { PLAYER.gold.val -= 3; goto("scene4") }},
      {label: "🏃 gå videre", handler: () => goto("scene23")}
    ];
    if (PLAYER.gold.val < 3) {
      text += " Du har ikke penge nok ☹️ og må gå videre.";
      actions.shift();
    } else {
      text += " Vil du blive på kroen eller gå videre?";
    }
    return Scene({ text, actions });
  },
  scene9: () => {
    let text = "Du finder et skur 🛖. Der står 11 på og der er en lås 🔒."
    let actions = [{label: "🏃 gå videre", handler: () => goto("scene18")}];
    if (PLAYER.inventory.val.includes(ITEMS.key11)) {
      text += " Du har en nøgle 🗝️ med nummer 11 på. Vil du ind i skuret?";
      actions.unshift({label: "🚪 gå ind", handler: () => goto("scene16")});
    } else {
      text += " Du har desværre ikke nogen nøgle der passer ☹️.";
    }
    return Scene({ text, actions });
  },
  scene10: () => {
    let text = "Du går videre langs vejen indtil den svinger.";
    if (PLAYER.inventory.val.length == 0) {
      text += " Du finder en kniv 🔪 langs vejen og tager den.";
      collectItem(ITEMS.knife);
    };
    const actions = [{label: "⬆️ fortsæt", handler: () => goto("scene26")}];
    return Scene({ text, actions })
  },
  scene11: () => {
    PLAYER.gold.val += 15;
    const text = "Du vinder over røveren 🥷. Du tager hans penge (15 guld) og fortsætter.";
    const actions = [{label: "⬆️ fortsæt", handler: () => goto("scene24")}];
    return Scene({ text, actions });
  },
  scene12: () => {
    const text = "Du er inde i den tætte skov 🌳. Du står ved et væltet træ 🪵. Hvilken vej tager du?";
    const actions = [
      {label: "⬅️ venstre", handler: () => goto("scene2")},
      {label: "➡️ højre", handler: () => goto("scene24")}
    ];
    return Scene({ text, actions });
  },
  scene13: () => {
    const text = "Du kommer i land. Du går et stykke vej og kommer til et sted hvor vejen deler sig. Vil du til venstre eller højre?";
    const actions = [
      {label: "⬅️ venstre", handler: () => goto("scene19")},
      {label: "➡️ højre", handler: () => goto("scene23")}];
    return Scene({ text, actions });
  },
  scene14: () => {
    const enemy = ENEMIES.wolf;
    ENEMY.hp = enemy.hp;
    const text = `Du følger stien ind i skoven 🌳. Du møder en ulv 🐺. Du kan ikke nå at løbe fra den, så du må kæmpe. Den har ${enemy.hp} HP. Vælg et angreb:`;
    const actions = getAttacks("scene14Battle");
    return Scene({ text, actions });
  },
  scene14Battle: () => {
    return battle("scene14Battle", "scene5", "deathScene", ENEMIES.wolf);
  },
  scene15: () => {
    PLAYER.gold.val = 0;
    PLAYER.inventory.val = [];
    PLAYER.hp.val = 2;
    const text = "Røveren tager dit guld 🪙 og alle dine ting. Du finder et sted at hvile dig og får lidt HP tilbage.";
    const actions = [{label: "⬆️ fortsæt", handler: () => goto("scene12")}];
    return Scene({ text, actions });
  },
  scene16: () => {
    collectItem(ITEMS.silverSword);
    const text = "Inde i skuret er der en bænk. På bænken finder du et sølvsværd 🗡️.";
    const actions = [{label: "⬆️ fortsæt", handler: () => goto("scene18")}];
    return Scene({ text, actions });
  },
  scene17: () => {
    const enemy = ENEMIES.gorilla;
    ENEMY.hp = enemy.hp;
    const text = `Du drejer ned ad den lille gade og møder en gorilla 🦍. Den er sur og løber hen imod dig. Du kan ikke nå at løbe væk og må kæmpe. Den har ${enemy.hp} HP. Vælg et angreb:`;
    const actions = getAttacks("scene17Battle");
    return Scene({ text, actions });
  },
  scene17Battle: () => {
    return battle("scene17Battle", "scene10", "deathScene", ENEMIES.gorilla);
  },
  scene18: () => {
    const enemy = ENEMIES.angryMan;
    ENEMY.hp = enemy.hp;
    const text = `Du går videre. Så får du pludselig øje på en mand. Han ser sur ud 😡! Han går hen mod dig. Det er ham der ejer huset! Han tager en lille kniv 🔪 frem. Du må kæmpe imod ham! Manden har ${enemy.hp} HP og en kniv der skader ${enemy.attackDamage}. Vælg et angreb:`;
    const actions = getAttacks("scene18Battle");
    return Scene({ text, actions });
  },
  scene18Battle: () => {
    return battle("scene18Battle", "scene6", "scene29", ENEMIES.angryMan);
  },
  scene19: () => {
    const text = "Du kommer til en lystig gade 🎉 fuld af mennesker og farver. Vil du fortsætte ad gaden eller dreje til venstre i et lille sving?";
    const actions = [
      {label: "⬆️ fortsæt", handler: () => goto("scene8")},
      {label: "↩️ drej", handler: () => goto("scene21")}
    ];
    return Scene({ text, actions });
  },
  scene20: () => {
    PLAYER.gold.val += 4;
    const text = "Du går ud med fiskestangen 🎣. Du sejler ud i båden 🚣 og finder nogle guldmønter 🪙 i båden. Slå med en terning 🎲 tre gange. Hver gang du slår en 6'er, fanger du en fisk 🐟. Hver fisk giver 2 HP og 1 point.";
    const actions = [{label: "🎲 slå med terninger", handler: () => goto("scene20Result")}];
    return Scene({ text, actions });
  },
  scene20Result: () => {
    const rolls = rollDice(3);
    const fishCaught = rolls.filter(x => x == 6).length;
    PLAYER.hp.val += 2 * fishCaught;
    PLAYER.points.val += fishCaught;
    let text = `Du har slået ${rolls[0]}, ${rolls[1]}, og ${rolls[2]}. Du fanger ${fishCaught} fisk 🐟.`
    if (fishCaught) {
      text += ` Du spiser og får ${2 * fishCaught} HP og ${fishCaught} point.`
    }
    const actions = [{label: "⬆️ fortsæt", handler: () => goto("scene13")}];
    return Scene({ text, actions });
  },
  scene21: () => {
    let text = "Du kommer forbi en lille bod 🛒. Du kan købe en bue 🏹 (5 skade) for 10 guld eller en stav 🦯 (2 skade) for 3 guld.";
    let actions = [{label: "🏃 gå videre", handler: () => goto("scene7")}];
    if (PLAYER.gold.val < 3) {
      text += " Du har ikke råd til at købe noget ☹️.";
      return Scene({ text, actions });
    }
    actions.unshift({label: "🦯 køb stav", handler: () => { collectItem(ITEMS.staff); PLAYER.gold.val -= 3; goto("scene7")}});
    if (PLAYER.gold.val < 10) {
      text += " Du har ikke råd til buen. Vil du købe staven eller gå videre?"
      return Scene({ text, actions });
    }
    text += " Vil du købe en af tingene eller gå videre?"
    actions.unshift({label: "🏹 køb bue", handler: () => { collectItem(ITEMS.bow); PLAYER.gold.val -= 10; goto("scene7")}});
    return Scene({ text, actions });
  },
  scene22: () => {
    const text = "Du kommer ud af skoven og ind i byen 🏘️. Der er to veje, en stor og en lille. Hvilken vej tager du?";
    const actions = [
      {label: "⬜ stor vej", handler: () => goto("scene10")},
      {label: "▫️ lille vej", handler: () => goto("scene17")}
    ];
    return Scene({ text, actions });
  },
  scene23: () => {
    const text = "Du møder en lille pige 👧 som leger ved et træ 🌲. »Kan du hjælpe mig?« spørger hun. »Min ven har stillet mig en gåde. Hvis du kan finde svaret, så må du få nogle af mine bær. Gåden er: Marie har tre døtre. Hver af dem har en bror. Hvor mange børn har Marie?«";
    const actions = [
      {label: "4", handler: () => goto("scene23Success")},
      {label: "6", handler: () => goto("scene23Failure")},
      {label: "8", handler: () => goto("scene23Failure")},
    ];
    return Scene({ text, actions });
  },
  scene23Success: () => {
    PLAYER.points.val += 2;
    const text = "Selvfølgelig. De tre døtre har den samme bror. Tak for hjælpen. Du må få mine bær 🍓 (2 point).";
    const actions = [{label: "⬆️ fortsæt", handler: () => goto("scene5")}];
    return Scene({ text, actions });
  },
  scene23Failure: () => {
    const text = "Pigen siger: »Nej, det er ikke det rigtige svar. Jeg har allerede prøvet at gætte på det.«";
    const actions = [{label: "⬆️ fortsæt", handler: () => goto("scene5")}];
    return Scene({ text, actions });
  },
  scene24: () => {
    const text = "Du er inde i den tætte skov 🌳. Du står ved en stor sten 🪨. Hvilken vej tager du?";
    const actions = [
      {label: "⬅️ venstre", handler: () => goto("scene2")},
      {label: "➡️ højre", handler: () => goto("scene12")}
    ];
    return Scene({ text, actions });
  },
  scene25: () => {
    PLAYER.points.val += 5;
    const text = "Du betaler manden og følger med ham. Han viser dig vej ud af byen! Du har vundet! Det har været sjovt i Måneby.";
    const actions = [{label: "⏮️ til start", handler: () => goto("intro")}];
    return Scene({ text, actions });
  },
  scene26: () => {
    const enemy = ENEMIES.guard;
    ENEMY.hp = enemy.hp;
    const text = `Endelig! Du når porten ⛩️. Nu skal du kæmpe mod en vagt 💂. Han har ${enemy.hp} HP og et spyd der skader ${enemy.attackDamage}. Vælg et angreb:`;
    const actions = getAttacks("scene26Battle");
    return Scene({ text, actions });
  },
  scene26Battle: () => {
    return battle("scene26Battle", "scene30", "scene29", ENEMIES.guard);
  },
  scene27: () => {
    let text = "Du går ud af døren 🚪. Du står i en have ☘️. Der er en lille robåd 🚣. Der er også en lille sø 💧.";
    let actions = [{label: "🏃 gå videre", handler: () => goto("scene9")}];
    if (PLAYER.inventory.val.includes(ITEMS.fishrod)) {
      text += " Du har en fiskestang 🎣 . Vil du fiske eller gå videre?";
      actions.unshift({label: "🎣 fiske", handler: () => goto("scene20")});
    } else {
      text += " Du har desværre ikke nogen fiskestang ☹️.";
    }
    return Scene({ text, actions });
  },
  scene28: () => {
    const text = "Du er inde i den tætte skov 🌳. Du står ved en lysning 🌄. Hvilken vej tager du?";
    const actions = [
      {label: "⬅️ venstre", handler: () => goto("scene22")},
      {label: "➡️ højre", handler: () => goto("scene12")}
    ];
    return Scene({ text, actions });
  },
  scene29: () => {
    const text = `Du har tabt kampen 🪦. Manden tager dig og putter dig i fængsel ⛓️. Du har tabt! Du fik ${PLAYER.points.val} point.`;
    const actions = [{label: "⏮️ til start", handler: () => goto("intro")}];
    return Scene({ text, actions });
  },
  scene30: () => {
    PLAYER.points.val += 3;
    const text = `Tillykke 🎆! Du har vundet. Du har fået ${PLAYER.points.val} point. Håber du har nydt det.`;
    const actions = [{label: "⏮️ til start", handler: () => goto("intro")}];
    return Scene({ text, actions });
  },
  deathScene: () => {
    const text = `Du er blevet dræbt 🪦. Spillet er slut. Du fik ${PLAYER.points.val} point.`;
    const actions = [{label: "⏮️ til start", handler: () => goto("intro")}];
    return Scene({ text, actions });
  }
}


// CONTROLLERS

function goto(sceneName) {
  game.querySelector(".scene").remove();
  van.add(game, SCENES[sceneName]());
}

function collectItem(itemName) {
  PLAYER.inventory.val = [...PLAYER.inventory.val, itemName];
}

function rollDice(times = 1, faces = 6) {
  return new Array(times).fill(0).map(_ => Math.floor(Math.random() * faces + 1));
}

function getAttacks(battleScene) {
  let actions = [];
  const addWeapon = (weapon) => {
    const totalHitChance = Math.min(100, weapon.hitChance + PLAYER.skills[weapon.type] * 10);
    actions.push({
      label: `${weapon.img} (${weapon.damage} ⚔️ ${totalHitChance}% 🎯)`,
      handler: () => {
        PLAYER.attackDamage = weapon.damage;
        PLAYER.hitChance = totalHitChance;
        goto(battleScene);
      }
    });
  }
  for (let item of PLAYER.inventory.val) {
    if (item.weapon) {
      addWeapon(item);
    }
  }
  addWeapon(ITEMS.fist);
  return actions;
}

function battle(battleScene, winScene, lossScene, enemy) {
  const playerHits = Math.random() * 100 < PLAYER.hitChance;
  const enemyHits = Math.random() * 100 < enemy.hitChance;
  let text = `Du kæmper mod ${enemy.name}.`;
  let actions = [];
  if (playerHits) {
    ENEMY.hp -= PLAYER.attackDamage;
    text += ` Dit angreb lykkedes 🎖️. Du skader fjenden ${PLAYER.attackDamage} ⚔️.`;
    if (ENEMY.hp <= 0) {
      text += ` Fjenden er død 🪦. Du får ${enemy.points} point ⭐.`;
      PLAYER.points.val += enemy.points;
      actions = [{label: "⬆️ fortsæt", handler: () => { goto(winScene) }}];
      return Scene({ text, actions });
    }
  } else {
    text += ` Du rammer forbi ❌.`
  }

  text += ` Fjenden har ${ENEMY.hp} HP ❤️ tilbage og går til modangreb.`;

  if (enemyHits) {
    PLAYER.hp.val -= enemy.attackDamage;
    text += ` Du får ${enemy.attackDamage} skade 💔.`;
    if (PLAYER.hp.val <= 0) {
      text += ` Du har tabt 🪦.`
      actions = [{label: "⬆️ fortsæt", handler: () => goto(lossScene)}];
      return Scene({ text, actions });
    }
  } else {
    text += " Du undviger angrebet 🛡.";
  }

  text += " Vælg et angreb:";
  actions = getAttacks(battleScene);
  return Scene({ text, actions });
}


// COMPONENTS

// text: string, actions: array of objects with button label and handler
const Scene = ({text, actions}) => div({class: "scene"},
  p({class: "text-galaxy-color"}, text),
  div({class: "grid"},
    ...actions.map((action) => button({class: "action-button", onclick: action.handler}, action.label))
  )
)

const StatusBar = () => div({class: "status-bar"},
  div({class: "stat grid"},
   div("❤️ HP: ", PLAYER.hp),
   div("💰 Guld: ", PLAYER.gold),
   div("⭐ Point: ", PLAYER.points)
  ),
  div({class: "stat grid"},
   div("🟢 Type: ", PLAYER.class),
   div("🎒 Rygsæk: ", van.derive(() => PLAYER.inventory.val.map(item => item.img).join(""))),
   div("")
  )
)

const game = div({id: "game", class: "container"},
    h1({class: "title"}, "🌙 Eventyret i Måneby 🏘️"),
    StatusBar(),
    SCENES.intro()
)

van.add(document.body, main({id: "main"}, game));
