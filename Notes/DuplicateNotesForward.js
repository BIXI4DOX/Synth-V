function getClientInfo() {
  return {
      name: "Duplicate Selected Notes Forward",
      category: "Notes",
      author: "https://github.com/BIXI4DOX/Synth-V/tree/main",
      versionNumber: 2,
      minEditorVersion: 65537 // 1.0.1 packed
    };
}



//////////////////////////////////////////
//										//
//	Also has Scroll To Selected Notes.	//
//										//
//////////////////////////////////////////



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// moves the piano roll viewport so the current selection is visible														//
// SCRIPT_TITLE = "Scroll To Selection Start";																				//
// 																															//
// From script "ScrollToSelectionStart", intergrated into this script.														//
// These are the variables needed to run the ViewPort function.																//
// > BIXI																													//
																															//
// desired number of pixels between the left side of the screen and the start of the selection								//
var OFFSET_H = 200;																											//
																															//
// number of pitches to offset vertical scrolling																			//
// negative values can be helpful for positioning the selection above the parameter panel instead of being blocked by it	//
var OFFSET_V = 0 //-6;																										//
																															//
// whether to scroll horizontally and vertically																			//
// if you want separate scripts/hotkeys for each, copy the script and modify these to your liking							//
var SCROLL_H = true;																										//
var SCROLL_V = true;																										//
																															//
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



//////////////////////////////////////////////////////////////////////////////////////////////////////
//From script "ScrollToSelectionStart", intergrated into this script.								//
// BIXI DOX																							//
																									//
																									//
function scrollViewport() {																			//
  var editorView = SV.getMainEditor();																//
  var selection = editorView.getSelection();														//
  var viewport = editorView.getNavigation();														//
  var selectedNotes = selection.getSelectedNotes();													//
  if (selectedNotes.length == 0) {																	//
    return;																							//
  }																									//
																									//
  var targetNote = selectedNotes[0];																//
																									//
  if (SCROLL_H) {																					//
    var padding = OFFSET_H / viewport.getTimePxPerUnit();											//
    var targetLeft = targetNote.getOnset() - padding;												//
    if (targetLeft < 0) {																			//
      targetLeft = 0;																				//
    }																								//
    viewport.setTimeLeft(targetLeft);																//
  }																									//
																									//
  if (SCROLL_V) {																					//
    viewport.setValueCenter(targetNote.getPitch() + OFFSET_V);										//
  }																									//
}																									//
																									//
																									//
//////////////////////////////////////////////////////////////////////////////////////////////////////



//////////////////////////////////////////////////////////////////////////////
function main() {															//
    var editor = SV.getMainEditor();										//
    var selection = editor.getSelection();									//
    var selectedNotes = selection.getSelectedNotes();						//
																			//
    if (!selectedNotes || selectedNotes.length === 0) {						//
        // SV.showMessageBox("Duplicate Notes", "No notes selected.");		//
        return;																//
    }																		//
																			//
    // Compute earliest onset and latest end across the selection			//
    var minOnset = selectedNotes[0].getOnset();								//
    var maxEnd   = selectedNotes[0].getEnd();								//
    for (var i = 0; i < selectedNotes.length; i++) {						//
        var nOn = selectedNotes[i].getOnset();								//
        var nEnd = selectedNotes[i].getEnd();								//
        if (nOn < minOnset) minOnset = nOn;									//
        if (nEnd >  maxEnd)  maxEnd = nEnd;									//
    }																		//
    var offset = maxEnd - minOnset;											//
    var newClones = [];														//
																			//
    // Duplicate every selected note and collect new clones					//
    for (var j = 0; j < selectedNotes.length; j++) {						//
        var note = selectedNotes[j];										//
        var parentGroup = note.getParent();									//
        if (!parentGroup) continue;											//
																			//
        var clone = note.clone();											//
        clone.setOnset(note.getOnset() + offset);							//
        parentGroup.addNote(clone);											//
																			//
        newClones.push(clone);												//
    }																		//
																			//
    // Update selection: clear old, select only the clones					//
    selection.clearAll();													//
    for (var k = 0; k < newClones.length; k++) {							//
        selection.selectNote(newClones[k]);									//
    }																		//
	scrollViewport();														//
    SV.finish();															//
}																			//
//////////////////////////////////////////////////////////////////////////////