function getClientInfo() {
    return {
        "name": SV.T("Shorten Notes by Grid"),
        "category": "Notes",
        "author": "BIXI DOX & ChatGPT",
        "versionNumber": 1,
        "minEditorVersion": 65540
    };
}


//////////////////////////////////////////
//										//
//	Also has Scroll To Selected Notes.	//
//										//
//////////////////////////////////////////



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
																															//
// moves the piano roll viewport so the current selection is visible														//
// recommended hotkey: f (focus) or v (view)																				//
var SCRIPT_TITLE = "Scroll To Selection Start";																				//
																															//
// desired number of pixels between the left side of the screen and the start of the selection								//
var OFFSET_H = 200;																											//
																															//
// number of pitches to offset vertical scrolling																			//
// negative values can be helpful for positioning the selection above the parameter panel instead of being blocked by it	//
var OFFSET_V = -6;																											//
																															//
// whether to scroll horizontally and vertically																			//
// if you want separate scripts/hotkeys for each, copy the script and modify these to your liking							//
var SCROLL_H = true;																										//
var SCROLL_V = true;																										//
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////
function scrollViewport() {												//
  var editorView = SV.getMainEditor();									//
  var selection = editorView.getSelection();							//
  var viewport = editorView.getNavigation();							//
  var selectedNotes = selection.getSelectedNotes();						//
  if (selectedNotes.length == 0) {										//
    return;																//
  }																		//
																		//
  var targetNote = selectedNotes[0];									//
																		//
  if (SCROLL_H) {														//
    var padding = OFFSET_H / viewport.getTimePxPerUnit();				//
    var targetLeft = targetNote.getOnset() - padding;					//
    if (targetLeft < 0) {												//
      targetLeft = 0;													//
    }																	//
    viewport.setTimeLeft(targetLeft);									//
  }																		//
																		//
  if (SCROLL_V) {														//
    viewport.setValueCenter(targetNote.getPitch() + OFFSET_V);			//
  }																		//
}																		//
//////////////////////////////////////////////////////////////////////////







//////////////////////////////////////////////////////////////////////////////
// Shorten selected notes by one snap grid unit, with smart snap for ends	//
function getSnapSetting() {													//
    var nav = SV.getMainEditor().getNavigation();							//
    var b = 0, c = 1e7;														//
    while (b === 0) {														//
        c += 5e6;															//
        b = nav.snap(b + c);												//
    }																		//
    return b;																//
}																			//
//////////////////////////////////////////////////////////////////////////////




//////////////////////////////////////////////////////////////////////////////
function smartSnap(pos, tol) {												//
    var nav = SV.getMainEditor().getNavigation();							//
    var snapped = nav.snap(pos);											//
    return Math.abs(pos - snapped) < tol ? snapped : pos;					//
}																			//
//////////////////////////////////////////////////////////////////////////////



//////////////////////////////////////////////////////////////////////////////////
function main() {																//
    var sel = SV.getMainEditor().getSelection().getSelectedNotes();				//
    if (sel.length === 0) return;												//
																				//
    var grid = getSnapSetting();												//
    var tolerance = Math.floor(grid / 4); // 25% of grid as tolerance			//
																				//
    for (var i = 0; i < sel.length; i++) {										//
        var note = sel[i];														//
        // Shorten by grid														//
        var newEnd = note.getOnset() + note.getDuration() - grid;				//
        // Prevent duration from going below one grid							//
        if (newEnd - note.getOnset() < grid) newEnd = note.getOnset() + grid;	//
        // Apply smart snap														//
        newEnd = smartSnap(newEnd, tolerance);									//
        note.setDuration(newEnd - note.getOnset());								//
//////////////////////////////////////////////////////////////////////////////////
    }


//////////////////////////
	scrollViewport();	//
//////////////////////////	

    SV.finish();
}


