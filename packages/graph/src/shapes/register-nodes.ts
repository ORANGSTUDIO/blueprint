// import { SCHEMA_TYPES } from '../consts/';
import { IG6 } from '../interfaces';

import LOGIC_BASE_NODE from './nodes/logic-base-node';
// import LOGIC_FUNC_NODE from './nodes/logic-func-node';
// import LOGIC_BACKEND_FUNC_NODE from './nodes/logic-backend-func-node';
// import LOGIC_VARIABLE_DETAIL_NODE from './nodes/logic-variable-detail-node';
// import LOGIC_VARIABLE_NODE from './nodes/logic-variable-node';
// import LOGIC_API_NODE from './nodes/logic-api-node';
// import LOGIC_LIBRARY_FUNC_NODE from './nodes/logic-library-func-node';

const registerNode: (G6: IG6) => void = (G6) => {
  // 注册方法节点
  LOGIC_BASE_NODE(G6);
  // LOGIC_FUNC_NODE(G6);
  // LOGIC_BACKEND_FUNC_NODE(G6);
  // LOGIC_API_NODE(G6);
  // LOGIC_LIBRARY_FUNC_NODE(G6);
  // LOGIC_VARIABLE_DETAIL_NODE(G6);

  // 注册变量节点
  // SCHEMA_TYPES.forEach((type: string) => LOGIC_VARIABLE_NODE(G6, type));
};

export default registerNode;
