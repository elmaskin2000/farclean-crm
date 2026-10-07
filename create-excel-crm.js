const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

async function createExcelCRM() {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Farclean';
  workbook.created = new Date();

  // ==========================================
  // SHEET 4: SETTINGS (DATA VALIDATION LISTS)
  // ==========================================
  const sheetSettings = workbook.addWorksheet('Settings');
  sheetSettings.columns = [
    { header: 'Pipeline Stages', key: 'stages', width: 20 },
    { header: 'Temperatures', key: 'temps', width: 20 },
    { header: 'Sales Names', key: 'sales', width: 20 },
  ];
  sheetSettings.getRow(1).font = { bold: true };
  
  const stages = ['1. Prospecting', '2. Qualification', '3. Quotation Sent', '4. Negotiation', '5. Closed WON', '6. Closed LOST'];
  const temps = ['COLD', 'WARM', 'HOT'];
  const sales = ['Budi (Sales)', 'Andi (Sales)', 'Siti (Admin)'];

  for (let i = 0; i < Math.max(stages.length, temps.length, sales.length); i++) {
    sheetSettings.addRow({
      stages: stages[i] || '',
      temps: temps[i] || '',
      sales: sales[i] || ''
    });
  }
  // Protect settings sheet ideally, but let's just leave it plain

  // ==========================================
  // SHEET 1: DASHBOARD
  // ==========================================
  const sheetDashboard = workbook.addWorksheet('Dashboard');
  sheetDashboard.getColumn('A').width = 25;
  sheetDashboard.getColumn('B').width = 20;
  
  sheetDashboard.mergeCells('A1:B1');
  sheetDashboard.getCell('A1').value = 'FARCLEAN CRM DASHBOARD';
  sheetDashboard.getCell('A1').font = { size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
  sheetDashboard.getCell('A1').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0056A4' } };
  sheetDashboard.getCell('A1').alignment = { horizontal: 'center' };

  sheetDashboard.getCell('A3').value = 'Total Pipeline Value:';
  sheetDashboard.getCell('B3').value = { formula: 'SUM(Opportunities!F:F)' };
  sheetDashboard.getCell('B3').numFmt = 'Rp #,##0';

  sheetDashboard.getCell('A4').value = 'Total Won Deals:';
  sheetDashboard.getCell('B4').value = { formula: 'COUNTIF(Opportunities!E:E, "5. Closed WON")' };

  sheetDashboard.getCell('A5').value = 'Total Leads:';
  sheetDashboard.getCell('B5').value = { formula: 'COUNTA(Leads!A:A)-1' };

  // ==========================================
  // SHEET 2: OPPORTUNITIES (PIPELINE)
  // ==========================================
  const sheetOpps = workbook.addWorksheet('Opportunities (Pipeline)');
  sheetOpps.columns = [
    { header: 'Project Name', key: 'project', width: 30 },
    { header: 'Company Name', key: 'company', width: 25 },
    { header: 'Contact Person', key: 'contact', width: 20 },
    { header: 'Sales Owner', key: 'sales', width: 20 },
    { header: 'Stage', key: 'stage', width: 25 },
    { header: 'Estimated Value (Rp)', key: 'value', width: 20 },
    { header: 'Expected Close Date', key: 'date', width: 20 },
    { header: 'Notes', key: 'notes', width: 40 },
  ];
  sheetOpps.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  sheetOpps.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0056A4' } };

  // Add Data Validation (Dropdowns)
  for (let i = 2; i <= 100; i++) {
    sheetOpps.getCell(`E${i}`).dataValidation = {
      type: 'list',
      allowBlank: true,
      formulae: ['Settings!$A$2:$A$7']
    };
    sheetOpps.getCell(`D${i}`).dataValidation = {
      type: 'list',
      allowBlank: true,
      formulae: ['Settings!$C$2:$C$4']
    };
    sheetOpps.getCell(`F${i}`).numFmt = 'Rp #,##0';
  }

  // Sample Data
  sheetOpps.addRow({
    project: 'Pengadaan Cleanroom Door RS',
    company: 'RS Medika',
    contact: 'Dr. Hendra',
    sales: 'Budi (Sales)',
    stage: '3. Quotation Sent',
    value: 45000000,
    date: new Date(2026, 10, 15),
    notes: 'Klien minta revisi diskon 5%'
  });

  // ==========================================
  // SHEET 3: LEADS
  // ==========================================
  const sheetLeads = workbook.addWorksheet('Leads');
  sheetLeads.columns = [
    { header: 'Company Name', key: 'company', width: 25 },
    { header: 'Contact Person', key: 'contact', width: 20 },
    { header: 'Phone / WA', key: 'phone', width: 20 },
    { header: 'Source', key: 'source', width: 20 },
    { header: 'Temperature', key: 'temp', width: 15 },
    { header: 'PIC', key: 'pic', width: 20 },
    { header: 'Next Follow Up', key: 'followup', width: 20 },
    { header: 'Status Notes', key: 'notes', width: 40 },
  ];
  sheetLeads.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  sheetLeads.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0056A4' } };

  // Add Data Validation
  for (let i = 2; i <= 100; i++) {
    sheetLeads.getCell(`E${i}`).dataValidation = {
      type: 'list',
      allowBlank: true,
      formulae: ['Settings!$B$2:$B$4']
    };
    sheetLeads.getCell(`F${i}`).dataValidation = {
      type: 'list',
      allowBlank: true,
      formulae: ['Settings!$C$2:$C$4']
    };
  }

  sheetLeads.addRow({
    company: 'PT Maju Bersama',
    contact: 'Pak Yanto',
    phone: '08123456789',
    source: 'Website',
    temp: 'WARM',
    pic: 'Andi (Sales)',
    followup: new Date(2026, 9, 20),
    notes: 'Sudah dikirim brosur, mau telepon besok'
  });

  const outputPath = path.join(process.cwd(), 'public', 'Farclean_CRM_Template.xlsx');
  await workbook.xlsx.writeFile(outputPath);
  console.log('CRM Template generated successfully at public/Farclean_CRM_Template.xlsx');
}

createExcelCRM().catch(console.error);
