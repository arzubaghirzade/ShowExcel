import { Component, OnInit, ViewChild, ViewEncapsulation, Inject  } from '@angular/core';
import { UploaderComponent } from '@syncfusion/ej2-angular-inputs';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {
  @ViewChild('defaultupload', {static: false} )
  public uploadObj: UploaderComponent;
  headers = [];
  headerData = [];
  rowData = [];

  private path: object = {
    saveUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Save',
    removeUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Remove'
  };
  public dropElement: HTMLElement = document.getElementsByClassName('control-fluid')[0] as HTMLElement;

  public onFileRemove(args): void {
    args.cancel = true;
  }
  ngOnInit() {

  }
  parseExcel(file) {
    const reader: FileReader = new FileReader();
    reader.onload = (e) => {
      const data = reader.result;
      const workbook = XLSX.read(data, {
        type: 'binary'
      });
      workbook.SheetNames.forEach((sheetName => {
        const xlRowObject = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        const jsonObject = JSON.stringify(xlRowObject);
        const results = JSON.parse(jsonObject);
        this.headers = this.formatData(results[0]);
        for (const obj of results) {
          this.headerData.push(obj);
        }
      }).bind(this), this);
    };

    this.rowData = this.headerData;
    reader.onerror = (ex => {
      console.log(ex);
    });
    (reader.readAsBinaryString(file));
  }

  formatData(obj) {
    const columns = [];
    const keys = Object.keys(obj)
    keys.forEach(element => {
      columns.push({headerName: element, field: element })
    });
    return columns;

  }
   onSuccess(args: any): void {
    const files = args.target.files;
    this.parseExcel(files[0]);
  }
}


