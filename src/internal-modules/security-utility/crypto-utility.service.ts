import { Injectable } from '@nestjs/common';
import { ICryptoUtility } from '.';

@Injectable()
export class CryptoUtilityService implements ICryptoUtility {}
