import { ActCheckProcessor } from "./act-check-processor";
import { RecordProvider } from "../core/record-provider";
import { GithubOutputWriter } from "../core/github-output-writer";

describe('ActCheckProcessor', () => {
    let recordProviderMock: jest.Mocked<RecordProvider>;
    let writerMock: jest.Mocked<GithubOutputWriter>;
    let processor: ActCheckProcessor;

    beforeEach(() => {
        recordProviderMock = {
            get: jest.fn(),
            set: jest.fn(),
            apply: jest.fn(),
        } as unknown as jest.Mocked<RecordProvider>;

        writerMock = {
            write: jest.fn(),
        } as unknown as jest.Mocked<GithubOutputWriter>;

        processor = new ActCheckProcessor(recordProviderMock, writerMock);
    });

    it('should write "true" if ACT key exists in recordProvider', () => {
        recordProviderMock.get.mockReturnValue('true');

        processor.process();

        expect(recordProviderMock.set).toHaveBeenCalledWith('ISACT', 'true');
        expect(recordProviderMock.apply).toHaveBeenCalled();
        expect(writerMock.write).toHaveBeenCalledWith('ISACT', 'true', true);
    });

    it('should write "false" if ACT key does not exist in recordProvider', () => {
        recordProviderMock.get.mockReturnValue('');

        processor.process();

        expect(recordProviderMock.set).toHaveBeenCalledWith('ISACT', 'false');
        expect(recordProviderMock.apply).toHaveBeenCalled();
        expect(writerMock.write).toHaveBeenCalledWith('ISACT', 'false', true);
    });

    it('should throw an error if recordProvider.set fails', () => {
        recordProviderMock.get.mockReturnValue('true');
        recordProviderMock.set.mockImplementation(() => {
            throw new Error('set failed');
        });

        expect(() => processor.process()).toThrow('set failed');
    });

    it('should throw an error if writer.write fails', () => {
        recordProviderMock.get.mockReturnValue('true');
        writerMock.write.mockImplementation(() => {
            throw new Error('write failed');
        });

        expect(() => processor.process()).toThrow('write failed');
    });
});