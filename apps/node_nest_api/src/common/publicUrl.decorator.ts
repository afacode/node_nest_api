import { SetMetadata } from '@nestjs/common';

export const IsPublicUrl = () => SetMetadata('IS_PUBLIC_URL', true);

export const IsPression = (...permission: string[]) => SetMetadata('IS_PRESSION', permission);
