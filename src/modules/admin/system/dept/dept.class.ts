import SysDepartment from "@/entities/admin/sys_department.entity";
import { ApiProperty } from "@nestjs/swagger";

export class DeptDetailInfo {
    @ApiProperty({ description: '当前查询的部门' })
    department?: SysDepartment;
  
    @ApiProperty({ description: '所属父级部门' })
    parentDepartment?: SysDepartment;
  }