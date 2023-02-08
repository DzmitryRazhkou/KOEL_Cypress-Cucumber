export class MainPage {
  mainPageLocators = {
    HOME_BTN: () => cy.get(".home"),
    PLAYLIST: () => cy.get("#playlists ul li a"),
    CREATE_NEW_PLAYLIST_PLUS_BTN: () =>
      cy.get("i[title='Create a new playlist']"),
    NEW_PLAYLIST: () =>
      cy.get("nav[class='menu playlist-menu'] ul li:nth-child(1)"),
    NEW_PLAYLIST_FIELD: () => cy.get("form[class='create'] input"),
    ALL_SONGS: () => cy.get("ul[class='menu'] li:nth-of-type(3)"),
    SONG_TITLE: () => cy.get("td[class='title']"),
    WHOLE_ROW: () => cy.get("tr[class='song-item']"),
    ADD_TO: () => cy.get("li[class='has-sub']"),
    ADD_TO_PLAYLIST: () => cy.get("ul[class='menu submenu menu-add-to'] li"),
    TITLE_SONG: () =>
      cy.get("tr[class='song-item selected'] td:nth-of-type(2)"),
    DELETE: () =>
      cy.get("nav[class='menu playlist-item-menu'] ul li:last-of-type"),
    SUBMIT: () => cy.get(".ok"),
    GREEN_POPUP: () => cy.get(".success"),
    GREEN_POPUP_DELETED: () => cy.get("div[class='success show'"),
  };

  validateMainPage(txt: string) {
    this.mainPageLocators.HOME_BTN().should("have.text", txt);
    cy.log(" =====> " + txt.toUpperCase() + " <===== ");
  }

  createNewPlayList(playListName: string): string {
    this.mainPageLocators.CREATE_NEW_PLAYLIST_PLUS_BTN().as("plusButton");
    cy.get("@plusButton").click();

    this.mainPageLocators.NEW_PLAYLIST().as("newPlaylist");
    cy.get("@newPlaylist").click();

    this.mainPageLocators.NEW_PLAYLIST_FIELD().as("playListField");
    cy.get("@playListField").type(playListName).type("{enter}");
    return playListName;
  }

  successCreatedGreenPopUp(message: string, playListName: string) {
    this.mainPageLocators.GREEN_POPUP().as("popUp");

    cy.get("@popUp").then((el) => {
      const txt = el.text();
      cy.log(txt);
      expect(txt).includes(message + " " + '"' + playListName + '."');
    });
  }

  createNewPlayListThruAPI(token: string, name: string) {
    cy.request({
      method: "POST",
      url: "https://bbb.testpro.io/api/playlist",
      headers: {
        Authorization: "Bearer " + token,
      },
      body: {
        name: name,
        songs: [],
        rules: null,
      },
    }).then((res) => {
      cy.log(JSON.stringify(res));

      expect(res).to.have.property("status", 200);
      expect(res.body).to.not.be.null;
      expect(res.body).to.has.property("name", name);
      let playlistID = res.body.id;
      cy.log(" =====> " + playlistID + " <===== ");

      let playlistName = res.body.name;
      cy.log(" =====> " + playlistName + " <===== ");
    });
  }

  doQueryDBCall(user_id: string, playlist: string) {
    cy.task(
      "queryDb",
      "SELECT name FROM playlists WHERE user_id = '" +
        user_id +
        "' and name = '" +
        playlist +
        "'"
    ).then((results: any) => {
      cy.log(
        " =====> THE PLAYLIST QUERY FROM DATABASE '" +
          results[0].name +
          "' <===== "
      );
      expect(results[0].name).to.equal(playlist);
    });
  }

  doQueryDB_DeleteCall(user_id: string, playlist: string) {
    cy.task(
      "queryDb",
      "SELECT name FROM playlists WHERE user_id = '" + user_id + "'"
    ).then((results: any) => {
      cy.log(" =====> THE PLAYLIST HAS BEEN DELETED <===== ");
      expect(results[0].name).to.eq(playlist);
    });
  }

  validateCreatedPlayList(createdPlayList: string) {
    this.mainPageLocators.PLAYLIST().as("listOfPlaylists");

    cy.get("@listOfPlaylists").each((ele) => {
      let playListNames = ele.text();
      if (createdPlayList.includes(playListNames)) {
      }
    });
    return createdPlayList;
  }

  renamePlayList(playListName: string, receivedPlaylistName: string): string {
    this.mainPageLocators.PLAYLIST().as("playLists");

    cy.get("@playLists").each((ele, index) => {
      let playListNames = ele.text();
      if (receivedPlaylistName.includes(playListNames)) {
        cy.get("#playlists ul li").as("list");

        cy.get("@list")
          .eq(index)
          .dblclick()
          .type("{selectall}{del}")
          .type(playListName)
          .type("{enter}");
      }
    });
    return playListName;
  }

  successUpdatedGreenPopUp(message: string, playListName: string) {
    this.mainPageLocators.GREEN_POPUP().as("popUp");

    cy.get("@popUp").then((el) => {
      const txt = el.text();
      cy.log(txt);
      expect(txt).includes(message + " " + '"' + playListName + '."');
    });
  }

  getAllSongs() {
    this.mainPageLocators.ALL_SONGS().as("allSongs");

    cy.get("@allSongs").click();
  }

  getCertainSongAddToPlaylist(songName: string, playList: string) {
    this.mainPageLocators.SONG_TITLE().as("songs");
    this.mainPageLocators.WHOLE_ROW().as("wholeRow");

    cy.get("@songs").each((ele, index) => {
      let songTitleText = ele.text();
      if (songTitleText.includes(songName)) {
        cy.get("@wholeRow").eq(index).rightclick({ metaKey: true });

        this.mainPageLocators.ADD_TO().as("addTo");
        cy.get("@addTo").trigger("mouseenter");

        this.mainPageLocators.ADD_TO_PLAYLIST().as("playLists");

        cy.get("@playLists").each((ele, index) => {
          let playListText = ele.text();
          if (playListText.includes(playList)) {
            cy.get("@playLists").eq(index).click();
          }
        });
      }
    });
  }

  reachOutPlaylist(updatedPlayList: string) {
    this.mainPageLocators.PLAYLIST().as("listOfPlaylists");

    cy.get("@listOfPlaylists").each((ele, index) => {
      let playListNames = ele.text();
      if (updatedPlayList.includes(playListNames)) {
        cy.get("@listOfPlaylists").eq(index).click();
      }
    });
  }

  successAddedToGreenPopUp(message: string, playListName: string) {
    cy.get("div[class='success show']").then((el) => {
      const txt = el.text();
      cy.log(txt);
      expect(txt).includes(message + " " + '"' + playListName + '."');
    });
  }

  validateAddedToSong(titleSong: string) {
    this.mainPageLocators.TITLE_SONG().as("titleSong");

    cy.get("@titleSong").then((el) => {
      let title = el.text();
      expect(titleSong.includes(title)).to.be.true;
      cy.log(" =====> " + title + " <===== ");
    });
  }

  deletePlayList(updatedPlayList: string): string {
    this.mainPageLocators.PLAYLIST().as("listOfPlaylists");

    cy.get("@listOfPlaylists").each((ele, index) => {
      let playListNames = ele.text();
      if (updatedPlayList.includes(playListNames)) {
        cy.get("#playlists ul li").eq(index).rightclick({ metaKey: true });
        cy.wait(1000);

        this.mainPageLocators.DELETE().as("delete");
        cy.get("@delete").click();

        this.mainPageLocators.SUBMIT().as("submitDelete");
        cy.get("@submitDelete").click();
      }
    });
    return updatedPlayList;
  }

  successDeletedGreenPopUp(message: string, playListName: string) {
    this.mainPageLocators.GREEN_POPUP_DELETED().then((el) => {
      const txt = el.text();
      cy.log(txt);
      expect(txt).includes(message + " " + '"' + playListName + '."');
    });
  }

  // Get URL:
  getURL() {
    cy.on("url:changed", (newUrl) => {
      const urlSplit = newUrl.split("/");
      const playListId = urlSplit[5];
      cy.log(playListId);
      return playListId;
    });
  }

  /*
  Set Up Equalizer Feature:
  */

  showEqualizer() {
    cy.get("button[class='control equalizer'] i").as("equalizer");

    cy.get("@equalizer").scrollIntoView();
    cy.get("@equalizer").click();
  }

  selectGenres(genre: any) {
    cy.get("label[class='select-wrapper']").find("select").as("genres");

    cy.get("@genres").select(genre).should("have.value", genre);
    cy.wait(1000);
  }

  randomIntFromInterval(min: any, max: any) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  /*
  Get Infobar Feature:
  */

  clickOnInfo() {
    cy.get("button[title='View song information']").as("info");
    cy.get("@info").scrollIntoView();
  }

  getInfoBar() {
    cy.get("div[role='tablist'] button:nth-child(1)").as("infoBar");
    cy.get("@infoBar").then((ele) => {
      const infoBarText = ele.text();
      cy.log(" =====> " + infoBarText + " <===== ");
    });
  }
}
