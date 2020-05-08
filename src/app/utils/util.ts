export class Util {
  constructor() { }

  public static telephoneMask(v) {
    v=v.replace(/\D/g,"");
    v=v.replace(/^(\d{2})(\d)/g,"($1) $2");
    v=v.replace(/(\d)(\d{4})$/,"$1-$2");
    return v;
  }

  public static zipCodeMask(v) {
    v = v.replace(/\D/g, '');
    v = v.replace(/(\d{2})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d{2,3})$/, '$1/$2');
    return v;
  }

  public static cpfMask(v) {
    v = v.replace(/\D/g, '');
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    return v;
  }

  public static cnpjMask(v) {
    v = v.replace(/\D/g, '');
    v = v.replace(/^(\d{2})(\d)/, '$1.$2');
    v = v.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
    v = v.replace(/\.(\d{3})(\d)/, '.$1/$2');
    v = v.replace(/(\d{4})(\d)/, '$1-$2');
    return v;
  }

  public static cpfCnpjMask(v){
    if (v && v.length > 0) {
      const type = v.replace(/\D/g, '').length < 12 ? 'cpf' : 'cnpj';

      if(type === 'cpf') {
        return this.cpfMask(v);
      } else {
        return this.cnpjMask(v);
      }
    }
  }

  public static checkCPF(inputCPF){
    let soma = 0;
    let resto;
    inputCPF = inputCPF.replace(/\D/g, '');
    if(inputCPF === '00000000000') { return false; }

    for(let i=1; i <= 9; i++) {
      soma = soma + parseInt(inputCPF.substring(i - 1, i)) * (11 - i);

      resto = (soma * 10) % 11;
    }

    if((resto == 10) || (resto == 11)) { resto = 0; }
    if(resto != parseInt(inputCPF.substring(9, 10))){ return false; }

    soma = 0;
    for(let i = 1; i <= 10; i++) {

      soma = soma + parseInt(inputCPF.substring(i - 1, i)) * (12 - i);
      resto = (soma * 10) % 11;
    }

    if((resto == 10) || (resto == 11)){ resto = 0; }
    if(resto != parseInt(inputCPF.substring(10, 11))) { return false; }
    return true;
  }
}