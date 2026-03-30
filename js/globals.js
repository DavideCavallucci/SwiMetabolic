// ==========================================
// INIZIALIZZAZIONE CANVAS E VARIABILI GLOBALI
// ==========================================
const canvas = new fabric.Canvas('tacticBoard', { selection: false });

const canvasWidth = 1000;
const canvasHeight = 550;
const centerW = canvasWidth / 2;
const centerH = canvasHeight / 2;

const goalLine = 85;  
const dist2m = 85;  
const dist5m = 220; 
const dist6m = 270; 

// Variabili per Campo Intero
const gX = 80; 
const f_d2m = 80; 
const f_d5m = 200; 
const f_d6m = 240;

let scenarioCorrente = 'pressing';
let coloreAttuale = '#0c4a6e'; 
let vistaAttuale = 'meta'; 
let usaTratteggio = false;
let modalitaAttuale = 'muovi'; 

// Variabili per la Cronologia (Undo)
let cronologiaStati = [];
let isRedoing = false; 

let rosterMemoria = {}; // Memoria globale dei nomi

canvas.setWidth(canvasWidth);
canvas.setHeight(canvasHeight);