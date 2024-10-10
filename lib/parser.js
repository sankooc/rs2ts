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
    const { nodeType, attributes, id, properties } = statement;
    switch (nodeType) {
      case 42: {
        if (attributes && attributes.length) {
          const seal = isSerial(attributes);
          if (seal) {
            const item = {
              name: id.name,
              properties: [],
            };
            const { properties: pros } = item;
            items.push(item);
            for (const property of properties) {
              const { id, nodeType, typeAnnotation } = property;
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
                    // console.log(id.name, typeAnnotation.name);
                    break;
                  }
                  case 117: {
                    const { typeCallee, typeArguments } = typeAnnotation;
                    const pre = typeCallee.name;
                    const ger = typeArguments[0].name;
                    const type = build_map[ger] || ger;
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
                    // console.log(id.name, pre, ger, typeAnnotation.nodeType);
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