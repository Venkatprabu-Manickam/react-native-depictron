import _ from 'lodash';
import DocumentPiceker from 'react-native-document-picker';

export const getInputType = subtype => {
  switch (subtype) {
    case 'text':
      return 'default';
    case 'tel':
      return 'phone-pad';
    case 'email':
      return 'email-address';
    default:
      return 'default';
  }
};

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export const getDocumentPicekerFileType = (types, allFileType = false) => {
  const allowedTypes = [];
  if (allFileType) {
    return [DocumentPiceker.types.allFiles];
  }
  for (const type of types) {
    switch (type) {
      case 'images':
        allowedTypes.push(DocumentPiceker.types.images);
        break;

      case 'plainText':
        allowedTypes.push(DocumentPiceker.types.plainText);
        break;

      case 'audio':
        allowedTypes.push(DocumentPiceker.types.audio);
        break;

      case 'pdf':
        allowedTypes.push(DocumentPiceker.types.pdf);
        break;

      case 'zip':
        allowedTypes.push(DocumentPiceker.types.zip);
        break;

      case 'csv':
        allowedTypes.push(DocumentPiceker.types.csv);
        break;

      case 'doc':
        allowedTypes.push(DocumentPiceker.types.doc);
        break;

      case 'docx':
        allowedTypes.push(DocumentPiceker.types.docx);
        break;

      case 'ppt':
        allowedTypes.push(DocumentPiceker.types.ppt);
        break;

      case 'pptx':
        allowedTypes.push(DocumentPiceker.types.pptx);
        break;

      case 'xls':
        allowedTypes.push(DocumentPiceker.types.xls);
        break;

      case 'xlsx':
        allowedTypes.push(DocumentPiceker.types.xlsx);
        break;

      default:
        break;
    }
  }

  return allowedTypes.length ? allowedTypes : [DocumentPiceker.types.images];
};

export const validateExpression = (expression, dependentId, dependentValue) => {
   if(!expression && !dependentId) return;
   let regExp = new RegExp(expression);
   return regExp.test(dependentValue);
}
