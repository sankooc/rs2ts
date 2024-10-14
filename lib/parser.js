import { rs } from "jinx-rust";


const isSerial = (attributes) => {
  for (const attr of attributes) {
    const { type, value } = attr;
    if (value.match(/Serialize/)) {
      return true
    }
  }
  return false;
}
const build_map = {
  String: 'string',
  u8: 'number',
  u16: 'number',
  u32: 'number',
  u64: 'number',
  usize: 'number',
  i8: 'number',
  i16: 'number',
  i32: 'number',
  i64: 'number',
  isize: 'number',
};


export const read = (content) => {
  const ast = rs.parseFile(content);
  const items = [];
  for (const statement of ast.program.ast) {
    const { nodeType, attributes, id, properties, generics } = statement;
    switch (nodeType) {
      case 42: {
        if (attributes && attributes.length) {
          const seal = isSerial(attributes);
          if (seal) {
            const item = {
              name: 'I' + id.name,
              properties: [],
              generics: [],
            };
            if(generics){
              item.generics = generics.map((f) => {return f.id.name})
            }
            const { properties: pros } = item;
            items.push(item);
            const getGeneric = (str) => {
              if (item.generics.indexOf(str) >= 0) {
                return str
              }
            }
            main: for (const property of properties) {
              const { id, nodeType, typeAnnotation, attributes } = property;
              if (attributes && attributes.length){
                for(const attr of attributes) {
                  const { value} = attr;
                  if(value == 'serde(skip_serializing)'){
                    continue main;
                  }
                }
              }
              if (nodeType === 44) {
                const { nodeType } = typeAnnotation;
                switch (nodeType) {
                  case 6: {
                    const type = build_map[typeAnnotation.name] || typeAnnotation.name;
                    pros.push({
                      identifier: id.name,
                      type,
                      isArray: false,
                      isOption: false,
                    });
                    break;
                  }
                  case 117: {
                    const { typeCallee, typeArguments } = typeAnnotation;
                    const pre = typeCallee.name;
                    const ger = typeArguments[0].name;
                    const type = build_map[ger] || getGeneric(ger) || `I${ger}`;
                    switch (pre) {
                      case 'Vec':
                      case 'HashSet':
                        pros.push({
                          identifier: id.name,
                          type,
                          isArray: true,
                          isOption: false,
                        });
                        break;
                      case 'Option':
                        pros.push({
                          identifier: id.name,
                          type,
                          isArray: false,
                          isOption: true,
                        });
                        break;
                    }
                    break;
                  }
                }
              }
            }
          }
        }
        // struct
        break;//
      }
    }
  }

  return items;
};