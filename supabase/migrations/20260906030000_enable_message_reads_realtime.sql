-- Enable Realtime for message_reads table
ALTER TABLE message_reads REPLICA IDENTITY FULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'message_reads'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE message_reads;
  END IF;
END $$;
