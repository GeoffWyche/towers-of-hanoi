"use strict";
/*
Code copyleft.
By Geoff Wyche - 2014.
Feel free to use and adapt.
Always give credit to the author (Geoff Wyche).
*/

var TOWER_WIDTH = 200;
var TOWER_HEIGHT = 220;
var PIECE_MAX_WIDTH = 170;
var PIECE_MIN_WIDTH = 50;e
var PIECE_STEP_WIDTH = 20;
var PIECE_HEIGHT = 40;

var TOWERS = [];

/*
  NOTE:
  order of pieces in HTML is the reverse of the order of pieces on the tower:
  Tower1
  7
  5
  1
  is legal, but
  Tower1
  1
  5
  7
  is not.
  a simple appendChildElement adds the piece to the top of the stack
*/

// true if a piece has been picked up
// false if all are down
var PIECE_UP = false;

// towerbuttons (event listeners)
var LISTENERS = [];

// the element that holds the piece, when picked up.
var HOLDER = null;

function handleTowerClick() {
    var t; // which tower was clicked.
    t = this.parentElement;
    if (PIECE_UP) {
	tryDrop(t);
    } else {
	pickupPiece(t);
    }
}

// try to pick up a piece from tower t
function pickupPiece(t) {
    var p; // a piece
    var clist; // list of children of containing tower 
    clist = t.getElementsByClassName("piececlass");
    if (clist.length > 0) {
	p = clist[clist.length - 1];
	// p is now the top piece in the tower
	p.parentElement.removeChild(p);
	HOLDER.appendChild(p);
	PIECE_UP = true;
	repositionPiece(p);
    }
}

// called when a piece is in the holder, and a tower is clicked.
// attempt to drop a piece into the clicked tower
// actually, the 'towerbutton' is clicked
function tryDrop(t) {
    // phes is Piece Holder ElementS
    var phes = HOLDER.getElementsByClassName("piececlass");
    var p;
    var i;
    if (phes.length > 0) {
	p = phes[0];
	if (dropPiece(t,p)) {
	    // success.  Piece was dropped.
	    // check for win +++ nyi
	}
    }
}

// t: a tower
// p: a piece to drop.
// returns true on success
// returns false on failure (can't drop larger on smaller)
function dropPiece(t,p) {
    var plist = t.getElementsByClassName("piececlass");
    var topPiece = null;
    
    if (plist.length > 0) {
	topPiece = plist[plist.length - 1];
	if (topPiece.pieceSize < p.pieceSize) {
	    return false;
	}
    }
    if (p.parentElement) {
	p.parentElement.removeChild(p);
    }
    t.appendChild(p);
    PIECE_UP = false;
    repositionPiece(p);
}

// reposition a piece in the containing element (for display)
// affects piece's top and left style attributes
function repositionPiece(p) {
    var numPieces;
    if (p.parentElement.id=="pieceholder") {
	// in the holder, center the piece.
	// holder's width=200, height=50
	setPieceTop(p,Math.round((50 - p.height)/2));
	setPieceLeft(p,Math.round((640 - p.width)/2));
	p.style["position"] = "relative";
	
    } else {
	// position depends on where in the tower it is.
	p.style["position"] = "absolute";
	numPieces = p.parentElement.getElementsByClassName("piececlass").length;
	setPieceTop(p,Math.round(TOWER_HEIGHT - (numPieces  * (PIECE_HEIGHT / 2))));
	setPieceLeft(p,Math.round((TOWER_WIDTH - p.width)/2));
    }
}

// create a new piece
// n is which piece (i.e. the size, 1..7)
function createPiece(n) {
    var p;
    p = document.createElement("IMG");
    p.pieceSize = n;
    p.id="p" + n;
    p.className="piececlass";
    setPieceWidth(p,PIECE_MIN_WIDTH + ((n - 1) * PIECE_STEP_WIDTH));
    setPieceHeight(p,PIECE_HEIGHT);
    p.src="Block" + n + "Wood.png";
//    p.style['backgroundColor'] = "red";
    p.style["position"] = "absolute";
    p.style['border']="0px";
//    p.style['borderRadius']="15px";
    p.style['padding']="0px";
    p.style['margin']="0px";
    //    p.style['backgroundImage']="url(\"Block" + n + "Stone.png\")";
    //p.style['backgroundImage']="url(\"Block" + n + "Wood.png\")";
    //    p.innerHTML="<img src='Block" + n + "Wood.png' />";
    p.zIndex = 300 - n;
    return p;
}

function setPieceLeft(p,x) {
    p.left = x;
    p.style.left = x.toString() + "px";
}

function setPieceTop(p,x) {
    p.top = x;
    p.style.top = x.toString() + "px";
}

function setPieceWidth(p,w) {
    p.width = w;
    p.style.width = w.toString() + "px";
}

function setPieceHeight(p,h) {
    p.height = h;
    p.style.height = h.toString() + "px";
}

function handleAboutClick() {
    location.reload();
}

var aboutText = "\n" +
    "Rules: , and you cannot place \n" +
    "a larger brick on top of a smaller brick.";

function handleAbout() {
    var a;
    a = document.createElement("SPAN");
    a.id = "aboutBox";
    a.style['width']="440px";
    a.style['height']="110px";
    a.style['position']="absolute";
    a.style['left']="100px";
    a.style['top']="100px";
    a.style['background']="#ffff70";
    a.style['border']="3px solid #000000";
    a.style['padding']="6px";
    a.style['font-family']="font1";
    a.innerHTML="<p style=\"font-family:font1;text-align:center;\">Move the stack of pieces from Tower 1 to Tower 3.<br>You can only move one piece at a time.<br>You cannot place a larger piece on a smaller piece.<br>(click box to reload page)</p>";
    a.addEventListener("click",handleAboutClick,false);
    a.zIndex=500;
    for (var i=0; i<LISTENERS.length; i++) {
	LISTENERS[i].removeEventListener("click",handleTowerClick);
    }
    //    var gh = document.getElementById("gameholder");
    // KILL KILL KILL!
    var allt = document.getElementsByClassName("towerclass");
    for (var ti=0; ti<allt.length; ti++) {
	allt[0].parentElement.removeChild(allt[ti]);
	allt = document.getElementsByClassName("towerclass");
    }
    document.body.appendChild(a);
}

function handleReset() {
    location.reload();
}

function app() {
    // set up global vars
    HOLDER = document.getElementById("pieceholder");
    
    var tc = document.getElementById("towercontainer");
    TOWERS[TOWERS.length]=document.getElementById("tower1");
    TOWERS[TOWERS.length]=document.getElementById("tower2");
    TOWERS[TOWERS.length]=document.getElementById("tower3");
    var t;
    t = TOWERS[0];
    var p;
    var i;
    /* set the size and location of the pieces */    
    for (i=7; i>=1; i--) {
	p=createPiece(i);
	dropPiece(t,p);
    }
    PIECE_UP = false;
    // set up click listeners
    LISTENERS = tc.getElementsByClassName("towerbutton");
    for (i=0; i<LISTENERS.length; i++) {
	LISTENERS[i].addEventListener("click",handleTowerClick);
    }
    var aboutButton = document.getElementById("aboutButton");
    aboutButton.addEventListener("click",handleAbout,false);
    var resetButton = document.getElementById("resetButton");
    resetButton.addEventListener("click",handleReset,false);
}
