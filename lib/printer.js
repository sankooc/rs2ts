import ts from 'typescript';
const factory = ts.factory;

//https://ts-ast-viewer.com/
const _define_val = (type, isArray) => {
  if (isArray) {
    return factory.createArrayTypeNode(factory.createTypeReferenceNode(
      _define_val(type, false),
      undefined
    ))
  } else {
    return factory.createIdentifier(type)
  }
}

const _define_property = (property) => {
  const { identifier, isOption, type, isArray } = property;
  let opt = undefined;
  if(isOption) {
    opt = factory.createToken(ts.SyntaxKind.QuestionToken);
  }
  return factory.createPropertySignature(
    undefined,
    factory.createIdentifier(identifier),
    opt,
    _define_val(type, isArray)
  );
}

const _define_interface = (item) => {
  const { name, properties } = item;
  return factory.createInterfaceDeclaration(
    [factory.createToken(ts.SyntaxKind.ExportKeyword)],
    factory.createIdentifier(name),
    undefined,
    undefined,
    properties.map(_define_property)
  );
}


export const build = (items = []) => {
  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
  const sourceFile = ts.createSourceFile(
  'gen.ts',
  '',
  ts.ScriptTarget.Latest,
  false,
  ts.ScriptKind.TS,
  );
  const nodes = items.map(_define_interface)
  const n = factory.createSourceFile(nodes);
  return printer.printNode(ts.EmitHint.Unspecified, n, sourceFile);
}