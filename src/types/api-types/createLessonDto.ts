/* eslint-disable */ 
/*
 * MMA
 * The MMA API description
 *
 * The version of the OpenAPI document: 0.1
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { ParticipantEntity } from './participantEntity';


export class CreateLessonDto { 
    participants?: ParticipantEntity;
    endDate: string;
    lessonTypeId: number;
    name: string;
    startDate: string;
    coachOrder?: Array<number>;
}

