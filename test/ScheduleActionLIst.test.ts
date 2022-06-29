import { MediaLiveClient, DescribeScheduleCommandOutput, ScheduleAction } from "@aws-sdk/client-medialive";
import { ScheduleActionList } from "../src";

jest.mock('@aws-sdk/client-medialive');
const client = new MediaLiveClient({
  region: 'ap-northeast-1',
});
const mockSend = client.send as jest.Mock;

const describeScheduleOutPuts: DescribeScheduleCommandOutput[] = [];

beforeAll(() => {

  for (const nextToken of ['xxxxxxxx', 'yyyyyyyy', undefined]) {

    const scheduleActions: ScheduleAction[] = [];

    for (let index = 0; index < 100; index++) {

      scheduleActions.push({
        ActionName: 'Main story start',
        ScheduleActionSettings: {
          HlsId3SegmentTaggingSettings: undefined,
          HlsTimedMetadataSettings: undefined,
          InputPrepareSettings: undefined,
          InputSwitchSettings: index % 2 === 0 ? {
            InputAttachmentNameReference: 'trial-input-mp4-program',
            InputClippingSettings: undefined,
            UrlPath: []
          } : undefined,
          MotionGraphicsImageActivateSettings: undefined,
          MotionGraphicsImageDeactivateSettings: undefined,
          PauseStateSettings: undefined,
          Scte35ReturnToNetworkSettings: undefined,
          Scte35SpliceInsertSettings: undefined,
          Scte35TimeSignalSettings: undefined,
          StaticImageActivateSettings: undefined,
          StaticImageDeactivateSettings: undefined
        },
        ScheduleActionStartSettings: {
          FixedModeScheduleActionStartSettings: undefined,
          FollowModeScheduleActionStartSettings: undefined,
          ImmediateModeScheduleActionStartSettings: {}
        }
      });
    
    }

    describeScheduleOutPuts.push({
      '$metadata': {
        httpStatusCode: 200,
        requestId: 'cd795862-dd34-4c5d-94fd-c199d690ca8b',
        extendedRequestId: undefined,
        cfId: 'lJJwv3CylrXaHGM-4ZoDIo0Hf0TV-1ARC541OV5bnSF75pRT7X9cqQ==',
        attempts: 1,
        totalRetryDelay: 0
      },
      NextToken: nextToken,
      ScheduleActions: scheduleActions,
    });

  }

});


beforeEach(() => {

  mockSend.mockClear();

});


test('Check test data', () => {

  expect(describeScheduleOutPuts).toHaveLength(3);

  for (const describeScheduleOutPut of describeScheduleOutPuts) {

    expect(describeScheduleOutPut.ScheduleActions).toHaveLength(100);
    let countInputSwitchSettings = 0;
    expect(describeScheduleOutPut.ScheduleActions).not.toBeUndefined();
    if (describeScheduleOutPut.ScheduleActions) {
      for (const scheduleAction of describeScheduleOutPut.ScheduleActions) {

        if (scheduleAction.ScheduleActionSettings?.InputSwitchSettings) countInputSwitchSettings++;

      }
    }
    expect(countInputSwitchSettings).toBe(50);

  }
  
});


test('Test of method "describeSchedule"', async () => {

  mockSend.mockResolvedValue(describeScheduleOutPuts[0]);
  const scheduleActionList = new ScheduleActionList({
    client: client,
    Id: '1',
  });
  const response = await scheduleActionList.describeSchedule({
    ChannelId: '1',
  });
  expect(mockSend).toHaveBeenCalledTimes(1);
  expect(response).toHaveProperty('$metadata', describeScheduleOutPuts[0].$metadata);
  expect(response).toHaveProperty('ScheduleActions', describeScheduleOutPuts[0].ScheduleActions);
  expect(response).toHaveProperty('NextToken', describeScheduleOutPuts[0].NextToken);

});


test('Test of method "load"', async () => {

  mockSend.mockResolvedValueOnce(describeScheduleOutPuts[0]).mockResolvedValueOnce(describeScheduleOutPuts[1]).mockResolvedValue(describeScheduleOutPuts[2]);
  const scheduleActionList = new ScheduleActionList({
    client: client,
    Id: '1',
  });
  const response = await scheduleActionList.load();
  expect(mockSend).toHaveBeenCalledTimes(3);
  expect(response).toHaveLength(300);
  for (const scheduleAction of response) {
    expect(scheduleAction).toHaveProperty('ActionName');
    expect(scheduleAction).toHaveProperty('ScheduleActionSettings');
    expect(scheduleAction).toHaveProperty('ScheduleActionStartSettings');
  }

});

test('Test of method "filter"', async () => {

  mockSend.mockResolvedValueOnce(describeScheduleOutPuts[0]).mockResolvedValueOnce(describeScheduleOutPuts[1]).mockResolvedValue(describeScheduleOutPuts[2]);
  const scheduleActionList = new ScheduleActionList({
    client: client,
    Id: '1',
  });
  await scheduleActionList.load();

  const filterTestFn = jest.fn();
  filterTestFn.mockReturnValueOnce(true)
  .mockReturnValueOnce(false)
  .mockReturnValueOnce(true)
  .mockReturnValueOnce(false)
  .mockReturnValueOnce(true)
  .mockReturnValueOnce(false)
  .mockReturnValueOnce(true)
  .mockReturnValueOnce(false)
  .mockReturnValueOnce(true)
  .mockReturnValue(false);
  const result = scheduleActionList.filter(ScheduleAction => filterTestFn(ScheduleAction));

  expect(filterTestFn.mock.calls.length).toBe(300);
  expect(result).toHaveLength(5);
  
});