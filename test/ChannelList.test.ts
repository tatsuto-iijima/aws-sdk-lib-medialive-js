import { MediaLiveClient, ListChannelsCommandOutput, ChannelSummary } from "@aws-sdk/client-medialive";
import { Channel, ChannelList, ScheduleActionList } from "../src";

jest.mock('@aws-sdk/client-medialive');
const client = new MediaLiveClient({
  region: 'ap-northeast-1',
});
const mockSend = client.send as jest.Mock;

const listChannelsOutPuts: ListChannelsCommandOutput[] = [];

beforeAll(() => {

  for (const nextToken of ['xxxxxxxx', 'yyyyyyyy', undefined]) {

    const channelSummaries: ChannelSummary[] = [];

    for (let index = 0; index < 100; index++) {

      const channelId = String(3283295 + listChannelsOutPuts.length * 100 + index);

      channelSummaries.push({
        Arn: 'arn:aws:medialive:ap-northeast-1:999999999999:channel:' + channelId,
        CdiInputSpecification: undefined,
        ChannelClass: 'SINGLE_PIPELINE',
        Destinations: [
          {
            Id: 'destination1',
            MediaPackageSettings: [],
            MultiplexSettings: undefined,
            Settings: [
              {
                PasswordParam: undefined,
                StreamName: 'xxxx-xxxx-xxxx-xxxx-xxxx',
                Url: 'rtmp://a.rtmp.youtube.com/live2',
                Username: undefined
              }
            ]
          }
        ],
        EgressEndpoints: [ { SourceIp: '54.150.215.115' } ],
        Id: channelId,
        InputAttachments: [
          {
            AutomaticInputFailoverSettings: undefined,
            InputAttachmentName: 'trial-input-mp4-program',
            InputId: '7626073',
            InputSettings: {
              AudioSelectors: [],
              CaptionSelectors: [],
              DeblockFilter: 'DISABLED',
              DenoiseFilter: 'DISABLED',
              FilterStrength: 1,
              InputFilter: 'AUTO',
              NetworkInputSettings: undefined,
              Scte35Pid: undefined,
              Smpte2038DataPreference: 'IGNORE',
              SourceEndBehavior: 'LOOP',
              VideoSelector: undefined
            }
          },
          {
            AutomaticInputFailoverSettings: undefined,
            InputAttachmentName: 'trial-input-mp4-filler',
            InputId: '325748',
            InputSettings: {
              AudioSelectors: [],
              CaptionSelectors: [],
              DeblockFilter: 'DISABLED',
              DenoiseFilter: 'DISABLED',
              FilterStrength: 1,
              InputFilter: 'AUTO',
              NetworkInputSettings: undefined,
              Scte35Pid: undefined,
              Smpte2038DataPreference: 'IGNORE',
              SourceEndBehavior: 'LOOP',
              VideoSelector: undefined
            }
          }
        ],
        InputSpecification: { Codec: 'AVC', MaximumBitrate: 'MAX_20_MBPS', Resolution: 'HD' },
        LogLevel: undefined,
        Maintenance: {
          MaintenanceDay: 'TUESDAY',
          MaintenanceDeadline: undefined,
          MaintenanceScheduledDate: undefined,
          MaintenanceStartTime: '22:00'
        },
        Name: 'trial-input-mp4',
        PipelinesRunningCount: 0,
        RoleArn: 'arn:aws:iam::xxxxxxxxxxxx:role/MediaLiveAccessRole',
        State: index % 4 === 0 ? 'IDLE' : index % 4 === 1 ? 'RUNNING' : index % 4 === 2 ? 'STARTING' : 'STOPPING',
        Tags: {},
        Vpc: undefined
      });
    
    }

    listChannelsOutPuts.push({
      '$metadata': {
        httpStatusCode: 200,
        requestId: '89cf193a-450a-4b60-8cc4-fb10c18a55cf',
        extendedRequestId: undefined,
        cfId: 'gbg2mKt3jnajXOcQlZiYLA_6o-JH3VBoG4rlXBwCfS_cw0ax7dj_HA==',
        attempts: 1,
        totalRetryDelay: 0
      },
      NextToken: nextToken,
      Channels: channelSummaries,
    });

  }

});


beforeEach(() => {

  mockSend.mockClear();

});


test('Check test data', () => {

  expect(listChannelsOutPuts).toHaveLength(3);
  for (const data of listChannelsOutPuts) {
    expect(data.Channels).toHaveLength(100);
    expect(data.Channels).toBeDefined();
    if (data.Channels) {
      let countIdle = 0;
      let countRunning = 0;
      let countStarting = 0;
      let countStopping = 0;
      for (const channelSummary of data.Channels) {
        if (channelSummary.State === 'IDLE') countIdle++;
        if (channelSummary.State === 'RUNNING') countRunning++;
        if (channelSummary.State === 'STARTING') countStarting++;
        if (channelSummary.State === 'STOPPING') countStopping++;
      }
      expect(countIdle).toBe(25);
      expect(countRunning).toBe(25);
      expect(countStarting).toBe(25);
      expect(countStopping).toBe(25);
    }
  }
  if (listChannelsOutPuts[0].Channels) expect(listChannelsOutPuts[0].Channels[0].Id).toBe('3283295');
  if (listChannelsOutPuts[0].Channels) expect(listChannelsOutPuts[0].Channels[99].Id).toBe('3283394');
  if (listChannelsOutPuts[1].Channels) expect(listChannelsOutPuts[1].Channels[0].Id).toBe('3283395');
  if (listChannelsOutPuts[1].Channels) expect(listChannelsOutPuts[1].Channels[99].Id).toBe('3283494');
  if (listChannelsOutPuts[2].Channels) expect(listChannelsOutPuts[2].Channels[0].Id).toBe('3283495');
  if (listChannelsOutPuts[2].Channels) expect(listChannelsOutPuts[2].Channels[99].Id).toBe('3283594');
  
});


test('Test of method "listChannels"', async () => {

  mockSend.mockResolvedValue(listChannelsOutPuts[0]);
  const channelList = new ChannelList({
    client: client,
  });
  const response = await channelList.listChannels({});
  expect(mockSend).toHaveBeenCalledTimes(1);
  expect(response).toHaveProperty('$metadata', listChannelsOutPuts[0].$metadata);
  expect(response).toHaveProperty('Channels', listChannelsOutPuts[0].Channels);
  expect(response).toHaveProperty('NextToken', listChannelsOutPuts[0].NextToken);

});


test('Test of method "load"', async () => {

  mockSend.mockResolvedValueOnce(listChannelsOutPuts[0]).mockResolvedValueOnce(listChannelsOutPuts[1]).mockResolvedValue(listChannelsOutPuts[2]);
  const channelList = new ChannelList({
    client: client,
  });
  const response = await channelList.load();
  expect(mockSend).toHaveBeenCalledTimes(3);
  expect(response).toHaveLength(300);
  for (const channel of response) {
    expect(channel).toBeInstanceOf(Channel);
  }

});

test('Test of method "filter"', async () => {

  mockSend.mockResolvedValueOnce(listChannelsOutPuts[0]).mockResolvedValueOnce(listChannelsOutPuts[1]).mockResolvedValue(listChannelsOutPuts[2]);
  const channelList = new ChannelList({
    client: client,
  });
  await channelList.load();

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
  const result = channelList.filter(channel => filterTestFn(channel));

  expect(filterTestFn.mock.calls.length).toBe(300);
  expect(result).toHaveLength(5);
  
});