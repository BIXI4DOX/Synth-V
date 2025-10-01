function getClientInfo() {
  return {
    "name": SV.T("Move Notes Up An Octave & Scroll To Notes"),
    "category": "Notes",
    "author": "https://github.com/BIXI4DOX/Synth-V/tree/main",
    "versionNumber": 1,
    "minEditorVersion": 65537
  }
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
var SCROLL_H = false;																										//
var SCROLL_V = true;																										//
																															//
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



//////////////////////////////////////////////////////////////////////
// moves a selection up one octave									//
// recommended hotkey: shift + up arrow								//
// SCRIPT_TITLE = "Move Notes Up An Octave & Scroll To Start";		//
																	//
function move() {													//
  var selection = SV.getMainEditor().getSelection();				//
  var selectedNotes = selection.getSelectedNotes();					//
  if (selectedNotes.length == 0) {									//
    return;															//
  }																	//
																	//
  for (var i = 0; i < selectedNotes.length; i++) {					//
    var pitch = selectedNotes[i].getPitch();						//
    selectedNotes[i].setPitch(pitch + 12);							//
  }																	//
}																	//
//////////////////////////////////////////////////////////////////////



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



//////////////////////
					//
function main() {	//
  move();			//
  scrollViewport();	//
  SV.finish();		//
}					//
					//
//////////////////////